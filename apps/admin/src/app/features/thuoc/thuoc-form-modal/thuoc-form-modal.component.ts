import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ThuocService } from '../thuoc.service';

@Component({
  selector: 'ttti-thuoc-form-modal',
  templateUrl: './thuoc-form-modal.component.html',
  styleUrls: ['./thuoc-form-modal.component.scss'],
})
export class ThuocFormModalComponent implements OnInit {
  @Input() modalParams: any;

  thuoc: any;

  destroy$ = new Subject();

  faSave = faSave;

  thuocFormModal: FormGroup;

  isAddNew = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private thuocService: ThuocService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.thuocFormModal = this.fb.group({
      tenThuoc: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      donVi: ['', [Validators.required, Validators.maxLength(20)] ],
      donGia: [null, [Validators.required] ],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.thuoc) {
      this.isAddNew = false;
      this.thuoc = { ...this.modalParams.thuoc };
      this.thuocFormModal.patchValue(this.thuoc);
    } else {
      this.isAddNew = true;
    }
  }

  onSubmit(){
    this.thuocFormModal.markAllAsTouched()
    if(this.thuocFormModal.valid){
      if(this.isAddNew){
        this.thuocService.create({
          ...this.thuocFormModal.value,
          tonKho: 0
        }).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Thêm thuốc thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        this.thuocService.update(this.thuoc.id, this.thuocFormModal.value).subscribe(thuoc => {
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
