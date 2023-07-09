import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NhaCungCapService } from '../nha-cung-cap.service';

@Component({
  selector: 'ttti-nha-cung-cap-form-modal',
  templateUrl: './nha-cung-cap-form-modal.component.html',
  styleUrls: ['./nha-cung-cap-form-modal.component.scss'],
})
export class NhaCungCapFormModalComponent implements OnInit {
  @Input() modalParams: any;

  nhaCungCap: any;

  destroy$ = new Subject();

  faSave = faSave;

  nhaCungCapFormModal: FormGroup;

  isAddNew = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private nhaCungCapService: NhaCungCapService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.nhaCungCapFormModal = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)] ],
      phone: ['', [Validators.required, Validators.maxLength(20)] ],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.nhaCungCap) {
      this.isAddNew = false;
      this.nhaCungCap = { ...this.modalParams.nhaCungCap };
      this.nhaCungCapFormModal.patchValue(this.nhaCungCap);
    } else {
      this.isAddNew = true;
    }
  }

  onSubmit(){
    this.nhaCungCapFormModal.markAllAsTouched();
    if(this.nhaCungCapFormModal.valid){
      if(this.isAddNew){
        this.nhaCungCapService.create(this.nhaCungCapFormModal.value).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Thêm nhà cung cấp thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        this.nhaCungCapService.update(this.nhaCungCap.id, this.nhaCungCapFormModal.value).subscribe(nhaCungCap => {
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
