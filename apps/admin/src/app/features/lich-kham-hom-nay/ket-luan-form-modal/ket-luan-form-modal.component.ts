import { Component, Input, OnInit } from '@angular/core';
import { LichKhamHomNayService } from '../lich-kham-hom-nay.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'ttti-ket-luan-form-modal',
  templateUrl: './ket-luan-form-modal.component.html',
  styleUrls: ['./ket-luan-form-modal.component.scss'],
})
export class KetLuanFormModalComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;

  destroy$ = new Subject();

  faSave = faSave;

  lichKhamFormModal: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private lichKhamService: LichKhamHomNayService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.lichKhamFormModal = this.fb.group({
      chanDoan: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.lichKham) {
      this.lichKham = { ...this.modalParams.lichKham };
      this.lichKhamFormModal.patchValue(this.lichKham);
    }
  }

  onSubmit(){
    this.lichKhamFormModal.markAllAsTouched()
    if(this.lichKhamFormModal.valid){
      this.lichKham = {
        ...this.lichKham,
        chanDoan: this.lichKhamFormModal.value.chanDoan,
        trangThai: 'Đã khám'
      }
      this.lichKhamService.update(this.lichKham.id, this.lichKham).subscribe(lichKham => {
        this.toastrService.success(this.translateService.instant('Kết luận thành công'));
        this.cancel(true);
      }, (error: any) => {
        this.toastrService.error(this.translateService.instant(error.error?.message));
      })
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
