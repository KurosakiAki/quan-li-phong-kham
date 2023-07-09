import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChuyenKhoaService } from '../chuyen-khoa.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'ttti-chuyen-khoa-form-modal',
  templateUrl: './chuyen-khoa-form-modal.component.html',
  styleUrls: ['./chuyen-khoa-form-modal.component.scss'],
})
export class ChuyenKhoaFormModalComponent implements OnInit {
  @Input() modalParams: any;

  chuyenKhoa: any;

  destroy$ = new Subject();

  faSave = faSave;

  chuyenKhoaFormModal: FormGroup;

  isAddNew = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private chuyenKhoaService: ChuyenKhoaService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.chuyenKhoaFormModal = this.fb.group({
      tenChuyenKhoa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.chuyenKhoa) {
      this.isAddNew = false;
      this.chuyenKhoa = { ...this.modalParams.chuyenKhoa };
      this.chuyenKhoaFormModal.patchValue(this.chuyenKhoa);
    } else {
      this.isAddNew = true;
    }
  }

  onSubmit(){
    this.chuyenKhoaFormModal.markAllAsTouched();
    if(this.chuyenKhoaFormModal.valid){
      if(this.isAddNew){
        this.chuyenKhoaService.create(this.chuyenKhoaFormModal.value).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Thêm chuyên khoa thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        this.chuyenKhoaService.update(this.chuyenKhoa.id, this.chuyenKhoaFormModal.value).subscribe(chuyenKhoa => {
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
