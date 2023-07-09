import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { NhapKhoThuocService } from '../nhap-kho-thuoc.service';
import { PrintService } from '../../print-page/print.service';

@Component({
  selector: 'ttti-nhap-kho-thuoc-form-modal',
  templateUrl: './nhap-kho-thuoc-form-modal.component.html',
  styleUrls: ['./nhap-kho-thuoc-form-modal.component.scss'],
})
export class NhapKhoThuocFormModalComponent implements OnInit {
  @Input() modalParams: any;

  nhapKhoThuoc: any;
  thuocList: any;
  nhaCungCapList: any;
  chiTietThuocList: any;
  removeList: any[] = [];
  donVi: any[] = ['Viên'];
  tongNhap: any[] = [0];
  tongTien: number = 0;
  chiTietThuoc: any;

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  nhapKhoThuocFormModal: FormGroup;

  isAddNew = false;
  minDate: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private nhapKhoThuocService: NhapKhoThuocService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private printService: PrintService
  ) {

    this.nhapKhoThuocFormModal = this.fb.group({
      nhaCungCapId: [null, [Validators.required] ],
      chiTiet: fb.array([]),
    });

    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  changeThuoc(thuoc: any, i: number){
    this.donVi[i] = thuoc.donVi;
  }

  getThuocList() {
    this.nhapKhoThuocService.listThuoc().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.thuocList = list;
    })
  }

  getNhaCungCapList() {
    this.nhapKhoThuocService.listNhaCungCap().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.nhaCungCapList = list;
    })
  }

  getChiTietThuocList(id: any) {
    this.nhapKhoThuocService.listChiTietThuocByNhapKhoThuocId(this.nhapKhoThuoc.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietThuocList = list;
        for (let i = 0; i < list.length; i++){
          this.addNewChiTiet();
          this.donVi[i] = list[i].thuoc?.donVi;
          this.tongNhap[i] = list[i].tongNhap;
        }
        this.chiTiet.patchValue(list);
    })
  }

  get chiTiet() : FormArray {
    return this.nhapKhoThuocFormModal.get("chiTiet") as FormArray
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
      id: [null],
      thuocId: [null, [Validators.required] ],
      soLuong: [1, [Validators.required] ],
      giaNhap: [0, [Validators.required] ],
      ngayHetHan: [null, [Validators.required] ],
    })
  }

  addNewChiTiet() {
    this.chiTiet.push(this.newChiTiet());
    this.donVi.push('Viên');
    this.tongNhap.push(0);
  }

  removeChiTiet(i: number) {
    if (!this.isAddNew){
      if (this.chiTiet.at(i)?.value.id){
        this.removeList.push(this.chiTiet.at(i)?.value.id)
      }
    }
    this.chiTiet.removeAt(i);
    this.donVi.splice(i, 1);
    this.tongNhap.splice(i, 1);
  }

  tongNhapChange(index: number){
    this.tongNhap[index] = this.chiTiet.at(index).value.giaNhap * this.chiTiet.at(index).value.soLuong;
    this.tongTien = 0;
    for (let item of this.tongNhap){
      this.tongTien = this.tongTien + item;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getThuocList();
    this.getNhaCungCapList();
    if (this.modalParams.nhapKhoThuoc) {
      this.isAddNew = false;
      this.nhapKhoThuoc = { ...this.modalParams.nhapKhoThuoc };
      this.nhapKhoThuocFormModal.patchValue(this.nhapKhoThuoc);
      this.tongTien = this.nhapKhoThuoc.tongTien;
      this.getChiTietThuocList(this.nhapKhoThuoc.id);
    } else {
      this.isAddNew = true;
      this.addNewChiTiet();
    }
  }

  onSubmit(print?: any){
    console.log(this.chiTiet.at(0)?.value)
    this.nhapKhoThuocFormModal.markAllAsTouched();
    if(this.nhapKhoThuocFormModal.valid){
      if(this.isAddNew){
        this.nhapKhoThuocService.create({
          ...this.nhapKhoThuocFormModal.value,
          tongTien: this.tongTien,
          trangThai: 'Chờ xác nhận',
        }).subscribe(res => {
          const observables = [];
          let i = 0;
  
          for (let item of this.chiTiet.controls){
            this.chiTietThuoc = {
              ...item.value,
              nhapKhoThuocId: res.id,
              soLuongConLai: item.value.soLuong,
              tongNhap: this.tongNhap[i],
              trangThai: 'Chờ xác nhận'
            }
            i = i + 1;
            observables.push(this.nhapKhoThuocService.createChiTiet(this.chiTietThuoc));
          }
          forkJoin(observables).subscribe(
            (results: any[]) => {
              if (print){
                this.printService.printDocument('mau-nhap-kho', res.id);
              }
              else this.toastrService.success(this.translateService.instant('Thêm phiếu nhập kho thành công'));
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
      else{
        this.nhapKhoThuocService.update(this.nhapKhoThuoc.id, {
          ...this.nhapKhoThuocFormModal.value,
          tongTien: this.tongTien
        }).subscribe(res => {
          const observables = [];
          let i = 0;
  
          for (let item of this.chiTiet.controls){
            if (item.value.id){
              observables.push(this.nhapKhoThuocService.updateChiTietThuoc(item.value.id, {
                ...item.value,
                soLuongConLai: item.value.soLuong,
                tongNhap: this.tongNhap[i],
              }))
            }
            else {
              this.chiTietThuoc = {
                ...item.value,
                nhapKhoThuocId: this.nhapKhoThuoc.id,
                soLuongConLai: item.value.soLuong,
                tongNhap: this.tongNhap[i],
                trangThai: 'Chờ xác nhận'
              }
              observables.push(this.nhapKhoThuocService.createChiTiet(this.chiTietThuoc));
            }
            
            i = i + 1;
          }

          if (this.removeList){
            for (let item of this.removeList){
              observables.push(this.nhapKhoThuocService.removeChiTietThuoc(item))
            }
          }
          forkJoin(observables).subscribe(
            (results: any[]) => {
              if (print){
                this.printService.printDocument('mau-nhap-kho', this.nhapKhoThuoc.id);
              }
              else this.toastrService.success(this.translateService.instant('Cập nhật thành công'));
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
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
