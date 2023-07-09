import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { faSave, faCirclePlus, faXmark, faPrint } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PrintService } from '../../print-page/print.service';
import { HoaDonService } from '../../hoa-don/hoa-don.service';
import { PhieuKhamBenhService } from '../phieu-kham-benh.service';

@Component({
  selector: 'ttti-lap-hoa-don',
  templateUrl: './lap-hoa-don.component.html',
  styleUrls: ['./lap-hoa-don.component.scss'],
})
export class LapHoaDonComponent implements OnInit {
  @Input() modalParams: any;

  phieuKhamBenh: any;
  thuocList: any;
  temp: any;
  dichVuList: any;
  chiTietPhieuKhamBenhList: any;

  donViThuoc: any[] = ['Viên'];
  thanhTienThuoc: any[] = [0];
  donGiaThuoc: any[] = [0];
  donViDichVu: any[] = ['Lần'];
  thanhTienDichVu: any[] = [0];
  donGiaDichVu: any[] = [0];
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: NgbActiveModal,
    private phieuKhamBenhService: PhieuKhamBenhService,
    private hoaDonService: HoaDonService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private printService: PrintService
  ) {

    this.hoaDonFormModal = this.fb.group({
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

  getThuocList() {
    this.phieuKhamBenhService.listThuoc().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        list.forEach((item: any) => {
          item.hienThi = item.tenThuoc + ' - Tồn kho: ' + item.tonKho;
        })
        this.thuocList = [...list];
        this.temp = [...list];
    })
  }

  getDichVuList() {
    this.phieuKhamBenhService.listDichVu().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.dichVuList = list;
    })
  }

  getChiTietPhieuKhamBenhList() {
    this.phieuKhamBenhService.listChiTietPhieuKhamBenhByPhieuKhamBenhId(this.phieuKhamBenh.id).pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
        this.chiTietPhieuKhamBenhList = list;
        for (let i = 0; i < list.length; i++){
          this.addNewChiTietDichVu();
          this.donViDichVu[i] = list[i].dichVu?.donVi;
          this.donGiaDichVu[i] = list[i].dichVu?.donGia;
          this.thanhTienDichVu[i] = list[i].dichVu?.donGia * list[i].soLuong;
        }
        this.chiTietDichVu.patchValue(list);
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

    if (this.modalParams.phieuKhamBenh) {
      this.phieuKhamBenh = { ...this.modalParams.phieuKhamBenh };
      this.getChiTietPhieuKhamBenhList();
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
      this.hoaDonService.create({
        khachHangId: this.phieuKhamBenh.lichKham?.khachHangId,
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
            thanhTien: this.thanhTienThuoc[j],
          }
          j = j + 1;
          observables.push(this.hoaDonService.createChiTiet(this.chiTietHoaDon));
        }

        observables.push(this.phieuKhamBenhService.update(this.phieuKhamBenh.id, {
          ...this.phieuKhamBenh,
          maHoaDon: res.maHoaDon
        }))
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
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
