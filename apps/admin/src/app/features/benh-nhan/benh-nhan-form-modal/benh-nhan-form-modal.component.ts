import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { BenhNhanService } from '../benh-nhan.service';

@Component({
  selector: 'ttti-benh-nhan-form-modal',
  templateUrl: './benh-nhan-form-modal.component.html',
  styleUrls: ['./benh-nhan-form-modal.component.scss'],
})
export class BenhNhanFormModalComponent implements OnInit {
  @Input() modalParams: any;
  benhNhanForm: FormGroup;

  destroy$ = new Subject();

  faSave = faSave;

  genderSelect = [
      'Nam',
      'Nữ'
  ];

  isAddNew = false;

  benhNhan: any;

  constructor(
      private fb: FormBuilder,
      private dialogRef: NgbActiveModal,
      private toastrService: ToastrService,
      private translateService: TranslateService,
      public benhNhanService: BenhNhanService,
      private dialog: NgbModal
  ) {
    this.benhNhanForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)] ],
      birthday: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(20)] ],
      address: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      tienSuBenh: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.modalParams.benhNhan) {
      this.isAddNew = false;
      this.benhNhan = { ...this.modalParams.benhNhan };
      this.benhNhanForm.patchValue(this.benhNhan);
    } else {
      this.isAddNew = true;
    }
  }

  validatePhone() {
    if (!this.benhNhanForm.value.phone) {
      return false;
    } else {
        return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.benhNhanForm.value.phone));
    }
  }

  onSubmit() {
    this.benhNhanForm.markAllAsTouched();
    if(this.benhNhanForm.valid){
      if(this.isAddNew){
        this.benhNhanService.create(this.benhNhanForm.value).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Thêm bệnh nhân thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        this.benhNhanService.update(this.benhNhan.id, this.benhNhanForm.value).subscribe(benhNhan => {
          this.toastrService.success(this.translateService.instant('Cập nhật thành công'));
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
