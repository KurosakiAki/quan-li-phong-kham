import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PhieuDichVuService } from '../../phieu-dich-vu/phieu-dich-vu.service';
import { PrintService } from '../../print-page/print.service';
import { LichKhamHomNayService } from '../lich-kham-hom-nay.service';

@Component({
  selector: 'ttti-lap-phieu-dich-vu',
  templateUrl: './lap-phieu-dich-vu.component.html',
  styleUrls: ['./lap-phieu-dich-vu.component.scss'],
})
export class LapPhieuDichVuComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;
  dichVuList: any;
  temp: any;
  donVi: any[] = ['Lần'];
  donGia: any[] = [0];
  phieuDichVu: any;
  chiTietPhieuDichVu: any;

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  phieuDichVuFormModal: FormGroup;

  isAddNew = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private phieuDichVuService: PhieuDichVuService,
    private lichKhamService: LichKhamHomNayService,
    private printService: PrintService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.phieuDichVuFormModal = this.fb.group({
      chanDoan: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      chiTiet: fb.array([]),
    });
  }

  changeDichVu(dichVu: any, i: number){
    this.donVi[i] = dichVu.donVi;
    this.donGia[i] = dichVu.donGia;
  }

  getDichVuList() {
    this.lichKhamService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list.filter((data: any) => data.loai != 'Khám bệnh');
    })
  }

  get chiTiet() : FormArray {
    return this.phieuDichVuFormModal.get("chiTiet") as FormArray
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
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
    if (this.modalParams.lichKham) {
      this.lichKham = { ...this.modalParams.lichKham };
      this.phieuDichVuFormModal.patchValue({
        chanDoan: this.lichKham.chanDoan
      });
    }
    this.addNewChiTiet();
  }

  onSubmit(print?: any){
    this.phieuDichVuFormModal.markAllAsTouched();
    this.phieuDichVu = {
      lichKhamId: this.lichKham.id,
      loai: 'Chỉ định',
    };
    if(this.phieuDichVuFormModal.valid){
      const lichKhamUpdate = this.lichKhamService.update(this.lichKham.id, {
        ...this.lichKham,
        chanDoan: this.phieuDichVuFormModal.value.chanDoan,
      })

      const phieuDichVuCreate = this.phieuDichVuService.create(this.phieuDichVu)

      forkJoin([lichKhamUpdate, phieuDichVuCreate]).subscribe(res => {
        const observables = [];
        for (let item of this.chiTiet.controls){
          this.chiTietPhieuDichVu = {
            phieuDichVuId: res[1].id,
            dichVuId: item.value.dichVuId,
            soLuong: item.value.soLuong,
          }
          observables.push(this.phieuDichVuService.createChiTiet(this.chiTietPhieuDichVu));
        }
        forkJoin(observables).subscribe(
          (results: any[]) => {
            if (print){
              this.printService.printDocument('mau-phieu-dich-vu', res[1].id);
            }
            else this.toastrService.success(this.translateService.instant('Lập phiếu dịch vụ thành công'));
            this.cancel(true);
          },
          (error: any) => {
            this.toastrService.error(this.translateService.instant(error.error?.message));
          },
        );
      }, (error: any) => {
        this.toastrService.error(this.translateService.instant(error.error?.message));
      })
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
