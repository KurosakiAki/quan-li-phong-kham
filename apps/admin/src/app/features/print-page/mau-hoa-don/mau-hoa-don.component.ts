import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { forkJoin } from 'rxjs';
import { parseISO } from 'date-fns';

@Component({
  selector: 'ttti-mau-hoa-don',
  templateUrl: './mau-hoa-don.component.html',
  styleUrls: ['./mau-hoa-don.component.scss'],
})
export class MauHoaDonComponent implements OnInit {
  id: number;
  hoaDon: any;
  chiTietHoaDonThuoc: any[] = [];
  chiTietHoaDonDichVu: any[] = [];

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
    const getHoaDon = this.printService.getHoaDon(this.id);
    const getChiTietHoaDon = this.printService.listChiTietHoaDon(this.id);

    forkJoin([getHoaDon, getChiTietHoaDon]).subscribe(results => {
      this.hoaDon = {
        ...results[0],
        tenBenhNhan: results[0].khachHang?.fullname,
        soDienThoai: results[0].khachHang?.phone,
        diaChi: results[0].khachHang?.address,
        tuoi: this.dateToAge(parseISO(results[0].khachHang?.birthday)),
        gioiTinh: results[0].khachHang?.gender,
      };

      this.chiTietHoaDonThuoc = results[1].filter(val => val.thuocId != null);
      this.chiTietHoaDonDichVu = results[1].filter(val => val.dichVuId != null);

      this.chiTietHoaDonThuoc.forEach((item: any) => {
        item.tenThuoc = item.thuoc?.tenThuoc;
        item.donViThuoc = item.thuoc?.donVi;
        item.donGiaThuoc = item.thuoc?.donGia;
        item.thanhTienThuoc = item.thanhTien;
        item.soLuongThuoc = item.soLuong;
      });

      this.chiTietHoaDonDichVu.forEach((item: any) => {
        item.tenDichVu = item.dichVu?.tenDichVu;
        item.donViDichVu = item.dichVu?.donVi;
        item.donGiaDichVu = item.dichVu?.donGia;
        item.thanhTienDichVu = item.thanhTien;
        item.soLuongDichVu = item.soLuong;
      });
      
      this.printService.getUser(this.hoaDon.updatedUser).subscribe(data =>{
        this.hoaDon = {
          ...this.hoaDon,
          tenUser: data.fullname
        }
        this.printService.onDataReady()
      })
    });
  }
}
