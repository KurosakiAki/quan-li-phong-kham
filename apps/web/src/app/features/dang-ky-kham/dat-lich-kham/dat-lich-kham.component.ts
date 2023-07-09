import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SystemLogObjectTypeEnum } from '@api-interfaces';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { daysInWeek, format, parse, parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Subject, map, switchMap } from 'rxjs';
import { TimePickerComponent } from '../../../common/components/timepicker/timepicker.component';
import { DangKyKhamService } from '../dang-ky-kham.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'dat-lich-kham',
  templateUrl: './dat-lich-kham.component.html',
  styleUrls: ['./dat-lich-kham.component.scss']
})
export class DatLichKhamComponent implements OnInit {
  @ViewChild(TimePickerComponent) child: any;
  @ViewChild('form') formDirective: any;

  minDate: any;

  bacSiId: any;

  lichKham: any;
  ngayKhamList:NgbDateStruct[] = [];
  gioKhamList:String[] = [];
  gioKhamTrongNgay:String[] = [];
  lichKhamForm: FormGroup;
  lichKhamId!: number;
  khachHangId!: number;
  systemLogType = SystemLogObjectTypeEnum.LICH_KHAM;

  disabledDates:NgbDateStruct[] = [];

  isDisabled: any;

  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public lichKhamService: DangKyKhamService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
  ) {
    if (authService.currentUser){
      this.khachHangId = authService.currentUser.roleId;
    }

    this.lichKhamForm = this.fb.group({
      tenBenhNhan: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      soDienThoai: ['', [Validators.required, Validators.maxLength(20)] ],
      diaChi: ['', [Validators.minLength(2), Validators.maxLength(255)] ],
      ngayKham: [null, Validators.required ],
      gioKham: [null, Validators.required],
      lyDo: ['', [Validators.required, Validators.maxLength(255)] ],
      email: ['', [Validators.minLength(2), Validators.maxLength(255)] ]
    });

    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  onDateSelect(date: NgbDateStruct){
    this.gioKhamTrongNgay = [];
    let i = 0;
    let j = 0;
    this.ngayKhamList.forEach(item => {
      if(item.day == date.day && item.month == date.month && item.year == date.year){
        this.gioKhamTrongNgay[i] = this.gioKhamList[j];
        i+=1;
      }
      j+=1;
    })
  }

  ngOnInit() {
    this.bacSiId = this.activatedRoute.snapshot.params['id'];
    if (this.authService.currentUser){
      this.lichKhamForm.patchValue({
        tenBenhNhan: this.authService.currentUser.fullname,
        soDienThoai: this.authService.currentUser.phone,
        diaChi: this.authService.currentUser.address,
        email: this.authService.currentUser.email
      });
      this.lichKhamForm.get('tenBenhNhan')?.disable();
      this.lichKhamForm.get('soDienThoai')?.disable();
      this.lichKhamForm.get('diaChi')?.disable();
      this.lichKhamForm.get('email')?.disable();
    }
    this.loadLichKhamList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  findIndexDate(check: any[], count: any) {
    return check.findIndex(elem => elem.year === count.year && elem.month === count.month && elem.day === count.day);
  }

  countDate = () => {
    this.disabledDates = [];
    const counts: any[] = [];
    const check: any[] = [];
    let i = 0;
    for (let count of this.ngayKhamList) {
      if (this.findIndexDate(check, count) == -1){
        check[i] = count;
        counts[i] = 1;
        i++;
      }
      else counts[this.findIndexDate(check, count)] = counts[this.findIndexDate(check, count)] + 1;
    }
    for (let j in counts){
      if(counts[j] == 48){
        this.disabledDates.push(check[j]);
      }
    }
    this.isDisabled = (date:NgbDate, current: { year: number; month: number } | undefined) => {
      return this.disabledDates.find(x=>NgbDate.from(x)?.equals(date))?true:false;
    }
  }

  loadLichKhamList = () => {
    this.lichKhamService.listByBacSi(this.bacSiId).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        const date = new Date(data[i].thoiGianKham);
        this.ngayKhamList[i] = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
        this.gioKhamList[i] = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:00`;
        this.countDate();
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
    if(this.child.isBlur) this.lichKhamForm.controls["gioKham"].markAsTouched();
  }

  validatePhone() {
    if (!this.lichKhamForm.value.soDienThoai) {
        return false;
    } else {
        return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.lichKhamForm.value.soDienThoai));
    }
  }

  onSubmit() {
    this.lichKhamForm.markAllAsTouched();
    if(this.lichKhamForm.valid && !this.validatePhone()){
      this.lichKham = this.lichKhamForm.getRawValue();
      const postData = {
        tenBenhNhan: this.lichKham.tenBenhNhan,
        soDienThoai: this.lichKham.soDienThoai,
        diaChi: this.lichKham.diaChi,
        email: this.lichKham.email,
        thoiGianKham: parseISO(format(this.lichKham.ngayKham, 'yyyy-MM-dd') + 'T' + this.lichKham.gioKham),
        lyDo: this.lichKham.lyDo,
        trangThai: "Chờ xác nhận",
        bacSiId: this.bacSiId,
        khachHangId: this.khachHangId
      }
      this.lichKhamService.create(postData).subscribe(data => {
        this.toastrService.success(this.translateService.instant('Thêm lịch khám thành công'));
        this.route.navigate(['/app/dang-ky-kham']);
      }, (error: any) => {
        this.toastrService.error(this.translateService.instant(error.error?.message));
        this.loadLichKhamList();
      })
      this.child.isBlur=false;
    }
  }
}
