import { Component, Input, OnInit } from '@angular/core';
import { LichKhamService } from '../lich-kham.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { BenhNhanService } from '../../benh-nhan/benh-nhan.service';
import { PrintService } from '../../print-page/print.service';

@Component({
  selector: 'ttti-lap-phieu-kham-benh',
  templateUrl: './lap-phieu-kham-benh.component.html',
  styleUrls: ['./lap-phieu-kham-benh.component.scss'],
})
export class LapPhieuKhamBenhComponent implements OnInit {
  @Input() modalParams: any;
  khamBenhForm: FormGroup;

  selectedOption: any;
  isAddNew: any;

  destroy$ = new Subject();

  faSave = faSave;

  dichVuList: any[] = [];
  specialistIdCopy: any = null;

  genderSelect = [
      'Nam',
      'Nữ'
  ];

  khamBenh: any;
  lichKham: any;

  constructor(
      private fb: FormBuilder,
      private dialogRef: NgbActiveModal,
      private toastrService: ToastrService,
      private translateService: TranslateService,
      public lichKhamService: LichKhamService,
      public benhNhanService: BenhNhanService,
      private printService: PrintService,
      private dialog: NgbModal
  ) {
    this.khamBenhForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)] ],
      birthday: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(20)] ],
      address: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      tienSuBenh: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      dichVuId: [null, [Validators.required]]
    });
  }

  getDichVuList() {
    this.lichKhamService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list.filter((data: any) => data.loai === 'Khám bệnh');
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getDichVuList();

    this.lichKham = this.modalParams.lichKham;

    if (this.modalParams.lichKham.khachHangId) {
      this.isAddNew = false;

      this.khamBenh = { ...this.modalParams.lichKham.khachHang };
      this.khamBenhForm.patchValue(this.khamBenh);
    } else {
      this.isAddNew = true;

      this.khamBenh = { ...this.modalParams.lichKham };
      this.khamBenhForm.patchValue({
        fullname: this.khamBenh.tenBenhNhan,
        email: this.khamBenh.email,
        phone: this.khamBenh.soDienThoai,
        address: this.khamBenh.diaChi
      });
    }
  }

  validatePhone() {
    if (!this.khamBenhForm.value.phone) {
      return false;
    } else {
      return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.khamBenhForm.value.phone));
    }
  }

  onSubmit() {
    this.khamBenhForm.markAllAsTouched();

    if(this.khamBenhForm.valid){
      if(this.isAddNew){
        const observables = [];

        observables.push(this.benhNhanService.create(this.khamBenhForm.value));
        observables.push(this.lichKhamService.createPhieuDichVu({
          lichKhamId: this.lichKham.id,
          loai: 'Khám bệnh',
        }))

        forkJoin(observables).subscribe((data: any) => {
          const observablesChild = []

          this.khamBenh = {
            ...this.khamBenh,
            trangThai: 'Chờ khám',
            khachHangId: data[0].id
          }

          observablesChild.push(this.lichKhamService.update(this.khamBenh.id, this.khamBenh))

          observablesChild.push(this.lichKhamService.createChiTietPhieuDichVu({
            phieuDichVuId: data[1].id,
            dichVuId: this.khamBenhForm.value.dichVuId,
            soLuong: 1
          }))

          forkJoin(observablesChild).subscribe((val: any) => {
            this.printService.printDocument('mau-phieu-kham-benh', data[1].id);
            this.cancel(true);
          }, (error: any) => {
            this.toastrService.error(this.translateService.instant(error.error?.message));
          })
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        const observables = [];

        observables.push(this.lichKhamService.createPhieuDichVu({
          lichKhamId: this.lichKham.id,
          loai: 'Khám bệnh',
        }))
        observables.push(this.lichKhamService.update(this.lichKham.id, {
          ...this.lichKham,
          trangThai: 'Chờ khám',
        }))

        forkJoin(observables).subscribe((data: any) => {
          this.lichKhamService.createChiTietPhieuDichVu({
            phieuDichVuId: data[0].id,
            dichVuId: this.khamBenhForm.value.dichVuId,
            soLuong: 1
          }).subscribe((val: any) => {
            this.printService.printDocument('mau-phieu-kham-benh', data[0].id);
            this.cancel(true);
          }, (error: any) => {
            this.toastrService.error(this.translateService.instant(error.error?.message));
          })
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
