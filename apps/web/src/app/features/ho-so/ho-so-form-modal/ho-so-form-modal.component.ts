import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, forkJoin } from 'rxjs';
import { HoSoService } from '../ho-so.service';

@Component({
  selector: 'ttti-ho-so-form-modal',
  templateUrl: './ho-so-form-modal.component.html',
  styleUrls: ['./ho-so-form-modal.component.scss'],
})
export class HoSoFormModalComponent implements OnInit {
  @Input() modalParams: any;

  lichKham: any;
  donThuoc: any;
  chiTietDonThuocList: any;
  phieuDichVuList: any;
  chiTietPhieuDichVuList: any;

  destroy$ = new Subject();

  constructor(
    private dialogRef: NgbActiveModal,
    private hoSoService: HoSoService,
    private translateService: TranslateService
  ) {}

  getDonthuoc = () => {
    this.hoSoService.getDonThuoc(this.lichKham.id).subscribe((data: any) => {
      this.donThuoc = data;
      this.hoSoService.listChiTietDonThuoc(data.id).subscribe((value: any) => {
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
    this.hoSoService.listPhieuDichVu(this.lichKham.id).subscribe((data: any) => {
      this.phieuDichVuList = data;
      const observables = [];

      for (let item of data){
        observables.push(this.hoSoService.listChiTietPhieuDichVu(item.id))
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

    this.listPhieuDichVu();
    this.getDonthuoc();
  }
}
