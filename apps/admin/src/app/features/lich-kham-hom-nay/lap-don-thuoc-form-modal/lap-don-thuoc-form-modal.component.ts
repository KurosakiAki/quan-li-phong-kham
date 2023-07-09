import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { DonThuocService } from '../../don-thuoc/don-thuoc.service';
import { LichKhamHomNayService } from '../lich-kham-hom-nay.service';
import { PrintService } from '../../print-page/print.service';

@Component({
  selector: 'ttti-lap-don-thuoc-form-modal',
  templateUrl: './lap-don-thuoc-form-modal.component.html',
  styleUrls: ['./lap-don-thuoc-form-modal.component.scss'],
})
export class LapDonThuocFormModalComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;
  thuocList: any;
  temp: any;
  donVi: any[] = ['Viên'];
  selectedItems: any[] = [];
  donThuoc: any;
  chiTietDonThuoc: any;

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  donThuocFormModal: FormGroup;

  isAddNew = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private donThuocService: DonThuocService,
    private lichKhamService: LichKhamHomNayService,
    private printService: PrintService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.donThuocFormModal = this.fb.group({
      chanDoan: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
      loiDan: ['', [Validators.minLength(2), Validators.maxLength(255)] ],
      chiTiet: fb.array([]),
    });
  }

  clickThuoc(thuoc: any){
    this.thuocList = [...this.temp.filter((item: any) => (thuoc.id === item.id) || !this.selectedItems.includes(item.id))];
  }

  changeThuoc(thuoc: any, i: number){
    this.donVi[i] = thuoc.donVi;

    this.selectedItems.push(thuoc.id);
  }

  getThuocList() {
    this.donThuocService.listThuoc().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
      list.forEach((item: any) => {
        item.hienThi = item.tenThuoc + ' - Tồn kho: ' + item.tonKho;
      })
      this.thuocList = [...list];
      this.temp = [...list];
    })
  }

  get chiTiet() : FormArray {
    return this.donThuocFormModal.get("chiTiet") as FormArray
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
      thuocId: [null, [Validators.required] ],
      soLuong: [1, [Validators.required] ],
      cachDung: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
    })
  }

  addNewChiTiet() {
    this.chiTiet.push(this.newChiTiet());
    this.donVi.push('Viên')
  }

  removeChiTiet(i: number) {
    this.selectedItems = this.selectedItems.filter(item => item !== this.chiTiet.at(i)?.value.thuocId);
    
    this.chiTiet.removeAt(i);
    this.donVi.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getThuocList();
    if (this.modalParams.lichKham) {
      this.lichKham = { ...this.modalParams.lichKham };
      this.donThuocFormModal.patchValue({
        chanDoan: this.lichKham.chanDoan
      });
    }
    this.addNewChiTiet();
  }

  onSubmit(print?: any){
    this.donThuocFormModal.markAllAsTouched();
    this.donThuoc = {
      lichKhamId: this.lichKham.id,
      loiDan: this.donThuocFormModal.value.loiDan
    };
    if(this.donThuocFormModal.valid){
      const lichKhamUpdate = this.lichKhamService.update(this.lichKham.id, {
        ...this.lichKham,
        chanDoan: this.donThuocFormModal.value.chanDoan,
        trangThai: 'Đã khám'
      })

      const donThuocCreate = this.donThuocService.create(this.donThuoc)

      forkJoin([lichKhamUpdate, donThuocCreate]).subscribe(res => {
        const observables = [];
        for (let item of this.chiTiet.controls){
          this.chiTietDonThuoc = {
            donThuocId: res[1].id,
            thuocId: item.value.thuocId,
            soLuong: item.value.soLuong,
            cachDung: item.value.cachDung,
          }
          observables.push(this.donThuocService.createChiTiet(this.chiTietDonThuoc));
        }
        forkJoin(observables).subscribe(
          (results: any[]) => {
            if (print){
              this.printService.printDocument('mau-don-thuoc', res[1].id);
            }
            else this.toastrService.success(this.translateService.instant('Lập đơn thuốc thành công'));
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
