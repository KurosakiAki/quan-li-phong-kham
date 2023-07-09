import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DichVuService } from '../dich-vu.service';

@Component({
  selector: 'ttti-dich-vu-form-modal',
  templateUrl: './dich-vu-form-modal.component.html',
  styleUrls: ['./dich-vu-form-modal.component.scss'],
})
export class DichVuFormModalComponent implements OnInit {
  @Input() modalParams: any;

  dichVu: any;

  destroy$ = new Subject();

  faSave = faSave;

  dichVuFormModal: FormGroup;

  isAddNew = false;

  typeList = [
    'Khám bệnh',
    'Chụp MRI - Cộng hưởng từ',
    'Xét nghiệm',
    'Nội soi',
    'Siêu âm',
    'CT Scanner'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private dichVuService: DichVuService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.dichVuFormModal = this.fb.group({
      tenDichVu: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
      donVi: ['', [Validators.required, Validators.maxLength(20)] ],
      donGia: [null, [Validators.required] ],
      loai: [null, [Validators.required] ]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.dichVu) {
      this.isAddNew = false;
      this.dichVu = { ...this.modalParams.dichVu };
      this.dichVuFormModal.patchValue(this.dichVu);
    } else {
      this.isAddNew = true;
    }
  }

  onSubmit(){
    this.dichVuFormModal.markAllAsTouched();
    if(this.dichVuFormModal.valid){
      if(this.isAddNew){
        this.dichVuService.create(this.dichVuFormModal.value).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Thêm dịch vụ thành công'));
          this.cancel(true);
        }, (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        })
      }
      else{
        this.dichVuService.update(this.dichVu.id, this.dichVuFormModal.value).subscribe(dichVu => {
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
