import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PrintService } from '../../print-page/print.service';
import { PhieuKhamBenhService } from '../phieu-kham-benh.service';

@Component({
  selector: 'ttti-phieu-kham-benh-form-modal',
  templateUrl: './phieu-kham-benh-form-modal.component.html',
  styleUrls: ['./phieu-kham-benh-form-modal.component.scss'],
})
export class PhieuKhamBenhFormModalComponent implements OnInit {
  @Input() modalParams: any;
  khamBenhForm: FormGroup;

  selectedOption: any;
  isAddNew: any;

  destroy$ = new Subject();

  faSave = faSave;
  faPrint = faPrint;

  dichVuList: any[] = [];
  chiTietPhieuKhamBenhList: any[] = [];
  specialistIdCopy: any = null;

  genderSelect = [
      'Nam',
      'Nữ'
  ];

  khamBenh: any;
  phieuKhamBenh: any;

  constructor(
      private fb: FormBuilder,
      private dialogRef: NgbActiveModal,
      private toastrService: ToastrService,
      private translateService: TranslateService,
      private printService: PrintService,
      private phieuKhamBenhService: PhieuKhamBenhService,
  ) {
    this.khamBenhForm = this.fb.group({
      dichVuId: [null, [Validators.required]]
    });
  }

  getChiTietPhieuKhamBenhList() {
    this.phieuKhamBenhService.listChiTietPhieuKhamBenhByPhieuKhamBenhId(this.phieuKhamBenh.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietPhieuKhamBenhList = list;
        this.khamBenhForm.patchValue({
          dichVuId: list[0].dichVuId,
        })
    })
  }

  getDichVuList() {
    this.phieuKhamBenhService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list.filter((data: any) => data.loai === 'Khám bệnh');
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getDichVuList();

    this.phieuKhamBenh = this.modalParams.phieuKhamBenh;

    if (this.modalParams.phieuKhamBenh) {
      this.getChiTietPhieuKhamBenhList();
    }
  }

  onSubmit(print?: any){
    this.khamBenhForm.markAllAsTouched();
    if(this.khamBenhForm.valid){

      this.phieuKhamBenhService.updateChiTiet(this.chiTietPhieuKhamBenhList[0].id, {
        ...this.chiTietPhieuKhamBenhList[0],
        dichVuId: this.khamBenhForm.value.dichVuId,
      }).subscribe((data: any) => {
        if (print){
          this.printService.printDocument('mau-phieu-kham-benh', this.phieuKhamBenh.id);
        }
        else this.toastrService.success(this.translateService.instant('Sửa phiếu khám bệnh thành công'));
        this.cancel(true);
      },
      (error: any) => {
        this.toastrService.error(this.translateService.instant(error.error?.message));
      })
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
