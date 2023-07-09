import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PrintService } from '../../print-page/print.service';
import { HoaDonService } from '../hoa-don.service';

@Component({
  selector: 'ttti-hoa-don-form-modal',
  templateUrl: './hoa-don-form-modal.component.html',
  styleUrls: ['./hoa-don-form-modal.component.scss'],
})
export class HoaDonFormModalComponent implements OnInit {
  @Input() modalParams: any;

  hoaDon: any;
  thuocList: any;
  temp: any;
  dichVuList: any;
  khachHangList: any;
  chiTiethoaDonListThuoc: any;
  chiTiethoaDonListDichVu: any;

  donViThuoc: any[] = ['Viên'];
  thanhTienThuoc: any[] = [0];
  donGiaThuoc: any[] = [0];
  donViDichVu: any[] = ['Lần'];
  thanhTienDichVu: any[] = [0];
  donGiaDichVu: any[] = [0];
  removeList: any[] = [];
  tongTien: number = 0;
  chiTietHoaDon: any;
  checkTonKho: any = true;

  destroy$ = new Subject();

  faSave = faSave;
  faCirclePlus = faCirclePlus;
  faXmark = faXmark;
  faPrint = faPrint;

  hoaDonFormModal: FormGroup;

  minDate: any;
  isAddNew: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private hoaDonService: HoaDonService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private printService: PrintService
  ) {

    this.hoaDonFormModal = this.fb.group({
      khachHangId: [null, [Validators.required]],
      chiTietThuoc: fb.array([]),
      chiTietDichVu: fb.array([]),
    });

    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  changeThuoc(thuoc: any, i: number){
    this.donViThuoc[i] = thuoc.donVi;
    this.donGiaThuoc[i] = thuoc.donGia;
    this.thanhTienChangeThuoc(i);
  }

  changeDichVu(dichVu: any, i: number){
    this.donViDichVu[i] = dichVu.donVi;
    this.donGiaDichVu[i] = dichVu.donGia;
    this.thanhTienChangeDichVu(i);
  }

  getKhachHangList() {
    this.hoaDonService.listKhachHang().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        list.forEach((item: any) => {
          item.hienThi = item.referenceId + ' - ' + item.fullname + ' - ' + item.phone;
        })
        this.khachHangList = list;
    })
  }

  getThuocList() {
    this.hoaDonService.listThuoc().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        list.forEach((item: any) => {
          item.hienThi = item.tenThuoc + ' - Tồn kho: ' + item.tonKho;
        })
        this.thuocList = [...list];
        this.temp = [...list];
    })
  }

  getDichVuList() {
    this.hoaDonService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list;
    })
  }

  getChiTietHoaDonList() {
    this.hoaDonService.listChiTietHoaDonByHoaDonId(this.hoaDon.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTiethoaDonListThuoc = list.filter((item: any) => item.thuocId);
        this.chiTiethoaDonListDichVu = list.filter((item: any) => item.dichVuId);

        for (let i = 0; i < this.chiTiethoaDonListThuoc.length; i++){
          this.addNewChiTietThuoc();
          this.donViThuoc[i] = this.chiTiethoaDonListThuoc[i].thuoc?.donVi;
          this.donGiaThuoc[i] = this.chiTiethoaDonListThuoc[i].thuoc?.donGia;
          this.thanhTienThuoc[i] = this.chiTiethoaDonListThuoc[i].thuoc?.donGia * this.chiTiethoaDonListThuoc[i].soLuong;
        }

        for (let i = 0; i < this.chiTiethoaDonListDichVu.length; i++){
          this.addNewChiTietDichVu();
          this.donViDichVu[i] = this.chiTiethoaDonListDichVu[i].dichVu?.donVi;
          this.donGiaDichVu[i] = this.chiTiethoaDonListDichVu[i].dichVu?.donGia;
          this.thanhTienDichVu[i] = this.chiTiethoaDonListDichVu[i].dichVu?.donGia * this.chiTiethoaDonListDichVu[i].soLuong;
        }

        this.chiTietThuoc.patchValue(this.chiTiethoaDonListThuoc);
        this.chiTietDichVu.patchValue(this.chiTiethoaDonListDichVu);
        this.sum();
    })
  }

  get chiTietThuoc() : FormArray {
    return this.hoaDonFormModal.get("chiTietThuoc") as FormArray
  }

  get chiTietDichVu() : FormArray {
    return this.hoaDonFormModal.get("chiTietDichVu") as FormArray
  }

  sum(){
    this.tongTien = 0;
    for (let item of this.thanhTienThuoc){
      this.tongTien = this.tongTien + item;
    }
    for (let item of this.thanhTienDichVu){
      this.tongTien = this.tongTien + item;
    }
  }

  newChiTietThuoc(): FormGroup {
    return this.fb.group({
      id: [null],
      thuocId: [null, [Validators.required] ],
      soLuong: [1, [Validators.required] ],
    })
  }

  addNewChiTietThuoc() {
    this.chiTietThuoc.push(this.newChiTietThuoc());
    this.donViThuoc.push('Viên');
    this.thanhTienThuoc.push(0);
    this.donGiaThuoc.push(0);
  }

  removeChiTietThuoc(i: number) {
    if (this.chiTietThuoc.at(i)?.value.id){
      this.removeList.push(this.chiTietThuoc.at(i)?.value.id)
    }

    this.chiTietThuoc.removeAt(i);
    this.donViThuoc.splice(i, 1);
    this.thanhTienThuoc.splice(i, 1);
    this.donGiaThuoc.splice(i, 1);
    this.sum();
  }

  thanhTienChangeThuoc(index: number){
    this.thanhTienThuoc[index] = this.donGiaThuoc[index] * this.chiTietThuoc.at(index).value.soLuong;
    this.sum();
  }

  newChiTietDichVu(): FormGroup {
    return this.fb.group({
      id: [null],
      dichVuId: [null, [Validators.required] ],
      soLuong: [1, [Validators.required] ],
    })
  }

  addNewChiTietDichVu() {
    this.chiTietDichVu.push(this.newChiTietDichVu());
    this.donViDichVu.push('Lần');
    this.thanhTienDichVu.push(0);
    this.donGiaDichVu.push(0);
  }

  removeChiTietDichVu(i: number) {
    if (this.chiTietDichVu.at(i)?.value.id){
      this.removeList.push(this.chiTietDichVu.at(i)?.value.id)
    }

    this.chiTietDichVu.removeAt(i);
    this.donViDichVu.splice(i, 1);
    this.thanhTienDichVu.splice(i, 1);
    this.donGiaDichVu.splice(i, 1);
    this.sum();
  }

  thanhTienChangeDichVu(index: number){
    this.thanhTienDichVu[index] = this.donGiaDichVu[index] * this.chiTietDichVu.at(index).value.soLuong;
    this.sum();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.getThuocList();
    this.getDichVuList();
    this.getKhachHangList();

    if (this.modalParams.hoaDon) {
      this.isAddNew = false;
      this.hoaDon = { ...this.modalParams.hoaDon };
      this.hoaDonFormModal.patchValue(this.hoaDon);
      this.hoaDonFormModal.get('khachHangId')?.disable();
      this.getChiTietHoaDonList();
    }
    else {
      this.isAddNew = true;
      this.addNewChiTietDichVu();
      this.addNewChiTietThuoc();
    }
  }

  onSubmit(print?: any){
    this.checkTonKho = true;
    this.hoaDonFormModal.markAllAsTouched();

    for (let item of this.chiTietThuoc.controls){
      if(this.temp.find((val: any) => val.id === item.value.thuocId).tonKho < item.value.soLuong){
        this.checkTonKho = false;
        this.toastrService.error(this.translateService.instant('Không đủ số lượng tồn kho'))
      }
    }

    if(this.hoaDonFormModal.valid && this.checkTonKho){
      if (this.isAddNew){
        this.hoaDonService.create({
          khachHangId: this.hoaDonFormModal.value.khachHangId,
          tongTien: this.tongTien,
          trangThai: 'Chưa thanh toán',
        }).subscribe(res => {
          const observables = [];
          let i = 0;
          let j = 0;
  
          for (let item of this.chiTietThuoc.controls){
            this.chiTietHoaDon = {
              ...item.value,
              hoaDonId: res.id,
              thanhTien: this.thanhTienThuoc[i],
            }
            i = i + 1;
            observables.push(this.hoaDonService.createChiTiet(this.chiTietHoaDon));
          }
          for (let item of this.chiTietDichVu.controls){
            this.chiTietHoaDon = {
              ...item.value,
              hoaDonId: res.id,
              thanhTien: this.thanhTienDichVu[j],
            }
            j = j + 1;
            observables.push(this.hoaDonService.createChiTiet(this.chiTietHoaDon));
          }

          forkJoin(observables).subscribe(
            (results: any[]) => {
              if (print){
                this.printService.printDocument('mau-hoa-don', res.id);
              }
              else this.toastrService.success(this.translateService.instant('Thêm hóa đơn thành công'));
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
      else {
        const observables = [];

        observables.push(this.hoaDonService.update(this.hoaDon.id, {
          ...this.hoaDon,
          tongTien: this.tongTien
        }));

        let i = 0;
        let j = 0;
    
        for (let item of this.chiTietThuoc.controls){
          if (item.value.id){
            observables.push(this.hoaDonService.updateChiTietHoaDon(item.value.id, {
              ...item.value,
              thanhTien: this.thanhTienThuoc[i],
              hoaDonId: this.hoaDon.id
            }))
          }
          else {
            this.chiTietHoaDon = {
              ...item.value,
              thanhTien: this.thanhTienThuoc[i],
              hoaDonId: this.hoaDon.id
            }
            observables.push(this.hoaDonService.createChiTiet(this.chiTietHoaDon));
          }
          i = i + 1;
        }

        

        for (let item of this.chiTietDichVu.controls){
          if (item.value.id){
            observables.push(this.hoaDonService.updateChiTietHoaDon(item.value.id, {
              ...item.value,
              thanhTien: this.thanhTienDichVu[j],
              hoaDonId: this.hoaDon.id
            }))
          }
          else {
            this.chiTietHoaDon = {
              ...item.value,
              thanhTien: this.thanhTienDichVu[j],
              hoaDonId: this.hoaDon.id
            }
            observables.push(this.hoaDonService.createChiTiet(this.chiTietHoaDon));
          }
          j = j + 1;
        }

        if (this.removeList){
          for (let item of this.removeList){
            observables.push(this.hoaDonService.removeChiTietHoaDon(item))
          }
        }
        forkJoin(observables).subscribe(
          (results: any[]) => {
            if (print){
              this.printService.printDocument('mau-hoa-don', this.hoaDon.id);
            }
            else this.toastrService.success(this.translateService.instant('Sửa hóa đơn thành công'));
            this.cancel(true);
          },
          (error: any) => {
            this.toastrService.error(this.translateService.instant(error.error?.message));
          },
        );
      }
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
