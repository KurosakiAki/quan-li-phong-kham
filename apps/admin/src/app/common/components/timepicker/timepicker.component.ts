import { DatePipe } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'm-timepicker',
    templateUrl: 'timepicker.component.html',
    styleUrls: ['./timepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePickerComponent),
            multi: true
        }
    ]
})

/**
 * Timepicker component
 * model has string value with format `d:m:s` eg: '15:46:38'
 * @Usage
    this.testForm = new FormGroup({
        time: new FormControl('15:46:38', [Validators.required])
    })

    //////////////////

    <form [formGroup]="testForm" style="width: 600px;">
        <div class="form-group row">
            <label class="text-sm-right form-label col-form-label col-sm-4">Thời gian</label>
            <div class="col-sm-8">
                <m-timepicker formControlName="time"></m-timepicker>
                <p>Value: {{testForm.controls['time'].value}}</p>
                <p>Valid: {{testForm.controls['time'].valid}}</p>
                <p>Errors: {{testForm.controls['time'].errors | json}}</p>
            </div>
        </div>
    </form>
 */
export class TimePickerComponent implements OnInit, ControlValueAccessor {
    @ViewChild('popover') popover?: NgbPopover;
    @Input() timeIntervals = 30;
    @Input() disabled = false;
    @Input() gioKham:String[] = [];

    value = '';
    viewValue = '';
    times: any[] = [];
    timesArray: any[] = [];
    timesValue: any[] = [];
    isClickingOnTimeList = false;
    isBlur = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(
        private elm: ElementRef
    ) { }

    ngOnInit() {

        // Generate time select
        let i = 0;
        while (i < 24 * 60) {
            this.timesArray.push(this.convertNumberToTime(i));
            i += this.timeIntervals;
        }
    }

    writeValue(value: string): void {
        this.value = this.convertInputTextToValue(value);
        this.viewValue = this.transform(this.value);
    }

    onFocus(){
        this.times = this.timesArray;
        this.times = this.times.filter((time) => {
            return !this.gioKham.some((filter) => {
              return filter === time.value;
            });
        });
    }

    convertNumberToTime(value: number) {
        const h = Math.floor(value / 60);
        const m = value % 60;
        return {
            h,
            m,
            text: this.transform(`${h}:${m}`),
            value: `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:00`
        }
    }

    selectTime(time: any) {
        this.value = `${time.h < 10 ? '0' + time.h : time.h}:${time.m < 10 ? '0' + time.m : time.m}:00`;
        this.viewValue = this.transform(this.value);
        this.onChange(this.value);
        if (this.popover) this.popover.close();
    }

    transform(value: string): string {
        if (!value) return '';
        let [h, m, s] = value.split(':');
        let a = 'AM';
        let hi = parseInt(h, 10);
        let mi = parseInt(m, 10);
        if (hi >= 12) {
            a = 'PM';
            if (hi > 12) hi -= 12;
        }

        if (hi === 0) hi = 12;

        return `${hi}:${mi < 10 ? '0' + mi : mi} ${a}`;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onListMouseDown() {
      this.isClickingOnTimeList = true;
    }

    onBlur(event: any) {
      this.isBlur = true;
      this.isClickingOnTimeList = false;
      if (this.isClickingOnTimeList) return;
      this.updateValueFromTyping(event.target.value);
    }

    onEnter(event: any) {
      this.updateValueFromTyping(event.target.value);
    }

    updateValueFromTyping(value: string) {
        if (this.popover) this.popover.close();
        this.value = this.convertInputTextToValue(value);
        this.viewValue = this.transform(this.value);
        this.onChange(this.value);
    }

    onPopoverShow() {
        // Convert time to number
        if (this.value) {
            let [h, m] = this.value.split(':');
            let n = parseInt(h, 10) * 60 + parseInt(m, 10);
            let scrollPercent = n / (24 * 60);

            const timeSelectElm = this.elm.nativeElement.querySelector('.time-select');
            timeSelectElm.scrollTop = timeSelectElm.scrollHeight * scrollPercent;
        }
    }

    convertInputTextToValue(text: string): string {
        if (!text) return '';
        text = text.toUpperCase().trim().replace(/  /g, ' ');
        let result = '';
        try {
            let [time, a] = text.split(' ');
            let [h, m] = time.split(':');
            let hi = parseInt(h, 10);
            let mi = parseInt(m, 10);
            if (isNaN(hi) || isNaN(mi) || hi > 24 || mi > 60) {
                result = '';
            } else {
                if (a === 'PM') {
                    if (hi < 12) hi += 12;
                }
                if (a === 'AM') {
                    if (hi === 12) hi = 0;
                }
                result = `${hi < 10 ? '0' + hi : hi}:${mi < 10 ? '0' + mi : mi}:00`;
            }
        } catch (err) {
            console.error(err);
            result = '';
        }
        return result;
    }

}
