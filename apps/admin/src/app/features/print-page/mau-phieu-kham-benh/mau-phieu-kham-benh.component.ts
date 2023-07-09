import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { parseISO } from 'date-fns';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ttti-mau-phieu-kham-benh',
  templateUrl: './mau-phieu-kham-benh.component.html',
  styleUrls: ['./mau-phieu-kham-benh.component.scss'],
})
export class MauPhieuKhamBenhComponent implements OnInit {
  id: number;
  user: any;
  lichKham: any;
  phieuDichVu: any;
  chiTietPhieuDichVu: any[] = [];

  constructor (
    route: ActivatedRoute,
    private printService: PrintService
  ) {
    this.id = route.snapshot.params['id'];
  }

  dateToAge(birthdate: any){
    let timeDiff = Math.abs(Date.now() - birthdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  ngOnInit() {
    const getPhieuDichVu = this.printService.getPhieuDichVu(this.id);
    const getChiTietPhieuDichVu = this.printService.listChiTietPhieuDichVu(this.id);

    forkJoin([getPhieuDichVu, getChiTietPhieuDichVu]).subscribe(results => {
      this.phieuDichVu = results[0];

      this.chiTietPhieuDichVu = results[1];
      this.chiTietPhieuDichVu.forEach((item: any) => {
        item.tenDichVu = item.dichVu?.tenDichVu;
        item.donVi = item.dichVu?.donVi;
      });

      const observables = [];

      observables.push(this.printService.getLichKham(results[0].lichKhamId));
      observables.push(this.printService.getUser(this.phieuDichVu.updatedUser));
      
      forkJoin(observables).subscribe((data: any) => {
        this.lichKham = {
          ...data[0],
          tenBacSi: data[0].bacSi?.fullname,
          chuyenKhoa: data[0].bacSi?.referenceId,
        };

        this.phieuDichVu = {
          ...this.phieuDichVu,
          tenUser: data[1].fullname
        }

        this.printService.getKhachHang(this.lichKham.khachHangId).subscribe(val => {
          this.user = {
            maBenhNhan: val.referenceId,
            tenBenhNhan: val.fullname,
            soDienThoai: val.phone,
            diaChi: val.address,
            tuoi: this.dateToAge(parseISO(val.birthday)),
            gioiTinh: val.gender,
          }

          this.printService.onDataReady();
        })
      });
    });
  }
}
