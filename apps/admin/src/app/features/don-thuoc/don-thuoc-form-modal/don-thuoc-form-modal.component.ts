import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSave, faCirclePlus, faPrint, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { DonThuocService } from '../don-thuoc.service';
import { PrintService } from '../../print-page/print.service';

@Component({
  selector: 'ttti-don-thuoc-form-modal',
  templateUrl: './don-thuoc-form-modal.component.html',
  styleUrls: ['./don-thuoc-form-modal.component.scss'],
})
export class DonThuocFormModalComponent implements OnInit {
  @Input() modalParams: any;

  donThuoc: any;
  thuocList: any;
  temp: any;
  donVi: any[] = ['Viên'];
  removeList: any[] = [];
  chiTietDonThuoc: any;
  chiTietDonThuocList: any;
  selectedItems: any[] = [];

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  donThuocFormModal: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private donThuocService: DonThuocService,
    private printService: PrintService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {

    this.donThuocFormModal = this.fb.group({
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

  getChiTietDonThuocList() {
    this.donThuocService.listChiTietDonThuocByDonThuocId(this.donThuoc.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietDonThuocList = list;
        for (let i = 0; i < list.length; i++){
          this.addNewChiTiet();
          this.donVi[i] = list[i].thuoc?.donVi;

          this.selectedItems.push(list[i].thuoc?.id);
        }
        this.chiTiet.patchValue(list);
    })
  }

  get chiTiet() : FormArray {
    return this.donThuocFormModal.get("chiTiet") as FormArray
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
      id: [null],
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

    if (this.chiTiet.at(i)?.value.id){
      this.removeList.push(this.chiTiet.at(i)?.value.id)
    }
    this.chiTiet.removeAt(i);
    this.donVi.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getThuocList();
    if (this.modalParams.donThuoc) {
      this.donThuoc = { ...this.modalParams.donThuoc };
      this.donThuocFormModal.patchValue(this.donThuoc);
      this.getChiTietDonThuocList();
    }
  }

  onSubmit(print?: any){
    this.donThuocFormModal.markAllAsTouched();
    this.donThuoc = {
      ...this.donThuoc,
      loiDan: this.donThuocFormModal.value.loiDan
    };
    if(this.donThuocFormModal.valid){
      const observables = [];

      observables.push(this.donThuocService.update(this.donThuoc.id, this.donThuoc));

      let i = 0;
  
      for (let item of this.chiTiet.controls){
        if (item.value.id){
          observables.push(this.donThuocService.updateChiTiet(item.value.id, {
            ...item.value,
            donThuocId: this.donThuoc.id
          }))
        }
        else {
          this.chiTietDonThuoc = {
            ...item.value,
            donThuocId: this.donThuoc.id
          }
          observables.push(this.donThuocService.createChiTiet(this.chiTietDonThuoc));
        }
        
        i = i + 1;
      }

      if (this.removeList){
        for (let item of this.removeList){
          observables.push(this.donThuocService.removeChiTiet(item))
        }
      }

      forkJoin(observables).subscribe(
        (results: any[]) => {
          if (print){
            this.printService.printDocument('mau-don-thuoc', this.donThuoc.id);
          }
          else this.toastrService.success(this.translateService.instant('Sửa đơn thuốc thành công'));
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
