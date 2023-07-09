import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PrintService } from '../../print-page/print.service';
import { PhieuDichVuService } from '../phieu-dich-vu.service';

@Component({
  selector: 'ttti-phieu-dich-vu-form-modal',
  templateUrl: './phieu-dich-vu-form-modal.component.html',
  styleUrls: ['./phieu-dich-vu-form-modal.component.scss'],
})
export class PhieuDichVuFormModalComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;
  dichVuList: any;
  temp: any;
  donVi: any[] = ['Lần'];
  donGia: any[] = [0];
  phieuDichVu: any;
  chiTietPhieuDichVu: any;
  removeList: any[] = [];

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  phieuDichVuFormModal: FormGroup;
  chiTietPhieuDichVuList: any;

  constructor(
      private fb: FormBuilder,
      private dialogRef: NgbActiveModal,
      private toastrService: ToastrService,
      private translateService: TranslateService,
      private printService: PrintService,
      private phieuDichVuService: PhieuDichVuService,
  ) {
    this.phieuDichVuFormModal = this.fb.group({
      chiTiet: fb.array([]),
    });
  }

  getChiTietPhieuDichVuList() {
    this.phieuDichVuService.listChiTietPhieuDichVuByPhieuDichVuId(this.phieuDichVu.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietPhieuDichVuList = list;
        for (let i = 0; i < list.length; i++){
          this.addNewChiTiet();
          this.donVi[i] = list[i].dichVu?.donVi;
          this.donGia[i] = list[i].dichVu?.donGia;
        }
        this.chiTiet.patchValue(list);
    })
  }

  changeDichVu(dichVu: any, i: number){
    this.donVi[i] = dichVu.donVi;
    this.donGia[i] = dichVu.donGia;
  }

  getDichVuList() {
    this.phieuDichVuService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list.filter((data: any) => data.loai != 'Khám bệnh');
    })
  }

  get chiTiet() : FormArray {
    return this.phieuDichVuFormModal.get("chiTiet") as FormArray
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
      id: [null],
      dichVuId: [null, [Validators.required] ],
      soLuong: [1, [Validators.required] ],
    })
  }

  addNewChiTiet() {
    this.chiTiet.push(this.newChiTiet());
    this.donVi.push('Lần');
    this.donGia.push(0);
  }

  removeChiTiet(i: number) {
    if (this.chiTiet.at(i)?.value.id){
      this.removeList.push(this.chiTiet.at(i)?.value.id)
    }

    this.chiTiet.removeAt(i);
    this.donVi.splice(i, 1);
    this.donGia.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getDichVuList();
    if (this.modalParams.phieuDichVu) {
      this.phieuDichVu = { ...this.modalParams.phieuDichVu };
      this.getChiTietPhieuDichVuList();
    }
  }

  onSubmit(print?: any){
    if(this.phieuDichVuFormModal.valid){
      const observables = [];
  
      for (let item of this.chiTiet.controls){
        if (item.value.id){
          observables.push(this.phieuDichVuService.updateChiTiet(item.value.id, {
            ...item.value,
            phieuDichVuId: this.phieuDichVu.id
          }))
        }
        else {
          this.chiTietPhieuDichVu = {
            ...item.value,
            phieuDichVuId: this.phieuDichVu.id
          }
          observables.push(this.phieuDichVuService.createChiTiet(this.chiTietPhieuDichVu));
        }
      }
      if (this.removeList){
        for (let item of this.removeList){
          observables.push(this.phieuDichVuService.removeChiTiet(item))
        }
      }

      forkJoin(observables).subscribe(
        (results: any[]) => {
          if (print){
            this.printService.printDocument('mau-phieu-dich-vu', this.phieuDichVu.id);
          }
          else this.toastrService.success(this.translateService.instant('Sửa phiếu dịch vụ thành công'));
          this.cancel(true);
        },
        (error: any) => {
          this.toastrService.error(this.translateService.instant(error.error?.message));
        },
      );
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
