import { Component, Input, OnInit } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BenhNhanService } from '../benh-nhan.service';

@Component({
  selector: 'ttti-xem-chi-tiet-form-modal',
  templateUrl: './xem-chi-tiet-form-modal.component.html',
  styleUrls: ['./xem-chi-tiet-form-modal.component.scss'],
})
export class XemChiTietFormModalComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;
  donThuoc: any;
  chiTietDonThuocList: any;
  phieuDichVuList: any;
  chiTietPhieuDichVuList: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private benhNhanService: BenhNhanService,
    private translateService: TranslateService
  ) {
    
  }

  getDonthuoc = () => {
    this.benhNhanService.getDonThuoc(this.lichKham.id).subscribe((data: any) => {
      this.donThuoc = data;
      this.benhNhanService.listChiTietDonThuoc(data.id).subscribe((value: any) => {
        value.forEach((item: any) => {
          item.tenThuoc = item.thuoc?.tenThuoc;
          item.donVi = item.thuoc?.donVi;
          item.donGia = item.thuoc?.donGia;
        })
        this.chiTietDonThuocList = value;
      })
    })
  }

  listPhieuDichVu = () => {
    this.benhNhanService.listPhieuDichVu(this.lichKham.id).subscribe((data: any) => {
      this.phieuDichVuList = data;
      const observables = [];

      for (let item of data){
        observables.push(this.benhNhanService.listChiTietPhieuDichVu(item.id))
      }

      forkJoin(observables).subscribe((value: any) => {
        for(let item of value){
          item.forEach((chiTiet: any) => {
            chiTiet.tenDichVu = chiTiet.dichVu?.tenDichVu;
            chiTiet.donVi = chiTiet.dichVu?.donVi;
            chiTiet.donGia = chiTiet.dichVu?.donGia;
          })
          
        }
        
        this.chiTietPhieuDichVuList = [...value];
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.lichKham) {
      this.lichKham = { ...this.modalParams.lichKham };
    }

    this.getDonthuoc();
    this.listPhieuDichVu();
  }
}
