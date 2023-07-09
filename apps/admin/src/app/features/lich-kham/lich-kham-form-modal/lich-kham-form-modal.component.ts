import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LichKhamService } from '../lich-kham.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { TimePickerComponent } from '../../../common/components/timepicker/timepicker.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { format, parseISO } from 'date-fns';
import { UserRoleEnum } from '@api-interfaces';

@Component({
  selector: 'ttti-lich-kham-form-modal',
  templateUrl: './lich-kham-form-modal.component.html',
  styleUrls: ['./lich-kham-form-modal.component.scss']
})
export class LichKhamFormModalComponent implements OnInit {

  @Input() modalParams: any;
  @ViewChild(TimePickerComponent) child: any;

  minDate: any;
  isDisabled: any;

  lichKham: any;

  selectedOption: any;

  bacSiList: any[] = [];
  benhNhanList: any[] = [];
  statusList = [
    'Chờ xác nhận',
    'Xác nhận',
    'Hủy bỏ'
  ];
  
  ngayKhamList: NgbDateStruct[] = [];
  gioKhamList: String[] = [];
  gioKhamTrongNgay: String[] = [];
  disabledDates: NgbDateStruct[] = [];

  destroy$ = new Subject();

  faSave = faSave;

  lichKhamForm: FormGroup;

  isAddNew = false;
  role: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private lichKhamService: LichKhamService,
    private authService: AuthService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {
    this.role = authService.role;

    this.lichKhamForm = this.fb.group({
      tenBenhNhan: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      soDienThoai: ['', [Validators.required, Validators.maxLength(20)] ],
      diaChi: ['', [Validators.minLength(2), Validators.maxLength(255)] ],
      email: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      ngayKham: [null, Validators.required ],
      gioKham: [null, Validators.required],
      lyDo: ['', [Validators.required, Validators.maxLength(255)] ],
      bacSiId: [null, [Validators.required] ],
      trangThai: ['Chờ xác nhận', [Validators.required] ],
      chanDoan: ['', [Validators.maxLength(255)] ],
    });

    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  getBenhNhanList() {
    this.lichKhamService.listBenhNhan().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.benhNhanList = list;
    })
  }

  getBacSiList() {
    this.lichKhamService.listBacSi().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.bacSiList = list;
    })
  }

  ngAfterViewChecked() {
    if(this.child.isBlur) this.lichKhamForm.controls["gioKham"].markAsTouched();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getBenhNhanList();
    this.getBacSiList();

    if(this.role === UserRoleEnum.DOCTOR){
      this.lichKhamForm.patchValue({
        bacSiId: this.authService.currentUser?.roleId
      })

      this.lichKhamForm.get('bacSiId')?.disable();

      this.onBacSiChange(this.authService.currentUser?.roleId);
    }

    if (this.modalParams.lichKham) {
      this.isAddNew = false;
      this.lichKham = { ...this.modalParams.lichKham };
      const date = new Date (this.lichKham.thoiGianKham);
      this.lichKham = {
        ...this.lichKham,
        ngayKham: date,
        gioKham: `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:00`
      }
      if (this.lichKham.khachHangId){
        this.selectedOption = this.lichKham.khachHangId;
        this.lichKhamForm.patchValue(this.lichKham);
        this.lichKhamForm.get('tenBenhNhan')?.disable();
        this.lichKhamForm.get('soDienThoai')?.disable();
        this.lichKhamForm.get('email')?.disable();
        this.lichKhamForm.get('diaChi')?.disable();
      }
      else this.lichKhamForm.patchValue(this.lichKham)
    } else {
      this.isAddNew = true;
      this.lichKham = {
        trangThai: ''
      }
    }
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

  onBacSiChange(event: any){
    this.lichKhamForm.patchValue({
      ngayKham: null,
      gioKham: null
    });

    this.lichKhamService.listLichKhamByBacSi(event).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        const date = new Date(data[i].thoiGianKham);
        this.ngayKhamList[i] = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
        this.gioKhamList[i] = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:00`;
        this.countDate();
      }
    });
  }

  onSelectChange(event: any) {
    if (event === null) {
        this.lichKhamForm.get('tenBenhNhan')?.enable();
        this.lichKhamForm.get('soDienThoai')?.enable();
        this.lichKhamForm.get('email')?.enable();
        this.lichKhamForm.get('diaChi')?.enable();
        this.lichKhamForm.patchValue({
          tenBenhNhan: '',
          soDienThoai: '',
          diaChi: '',
          email: ''
        });
    } else {
        const benhNhan = this.benhNhanList.find(item => item.id === event);
        this.lichKhamForm.patchValue({
          tenBenhNhan: benhNhan.fullname,
          soDienThoai: benhNhan.phone,
          diaChi: benhNhan.address,
          email: benhNhan.email
        });
        this.lichKhamForm.get('tenBenhNhan')?.disable();
        this.lichKhamForm.get('soDienThoai')?.disable();
        this.lichKhamForm.get('email')?.disable();
        this.lichKhamForm.get('diaChi')?.disable();
    }
  }

  validatePhone() {
    if (!this.lichKhamForm.value.soDienThoai) {
        return false;
    } else {
        return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.lichKhamForm.value.soDienThoai));
    }
  }

  onSubmit(){
    this.lichKhamForm.markAllAsTouched();
    
    if(this.lichKhamForm.valid && !this.validatePhone()){
      const postData = {
        ...this.lichKhamForm.getRawValue(),
        thoiGianKham: parseISO(format(this.lichKhamForm.getRawValue().ngayKham, 'yyyy-MM-dd') + 'T' + this.lichKhamForm.getRawValue().gioKham),
        khachHangId: this.selectedOption ? this.selectedOption : null
      }
      if(this.isAddNew){
        this.lichKhamService.create(postData).subscribe(data => {
          this.toastrService.success(this.translateService.instant('Thêm lịch khám thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else {
        this.lichKhamService.update(this.lichKham.id, postData).subscribe(data => {
          this.toastrService.success(this.translateService.instant('Sửa lịch khám thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
