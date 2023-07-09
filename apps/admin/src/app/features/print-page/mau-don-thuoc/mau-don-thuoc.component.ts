import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { parseISO } from 'date-fns';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ttti-mau-don-thuoc',
  templateUrl: './mau-don-thuoc.component.html',
  styleUrls: ['./mau-don-thuoc.component.scss'],
})
export class MauDonThuocComponent implements OnInit {
  id: number;
  lichKham: any;
  donThuoc: any;
  chiTietDonThuoc: any[] = [];

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
    const getDonThuoc = this.printService.getDonThuoc(this.id);
    const getChiTietDonThuoc = this.printService.listChiTietDonThuoc(this.id);

    forkJoin([getDonThuoc, getChiTietDonThuoc]).subscribe(results => {
      this.donThuoc = results[0];

      this.chiTietDonThuoc = results[1];
      this.chiTietDonThuoc.forEach((item: any) => {
        item.tenThuoc = item.thuoc?.tenThuoc;
        item.donVi = item.thuoc?.donVi;
      });
      
      this.printService.getLichKham(results[0].lichKhamId).subscribe((data: any) => {
        this.lichKham = {
          ...data,
          tenBenhNhan: data.khachHang?.fullname,
          soDienThoai: data.khachHang?.phone,
          diaChi: data.khachHang?.address,
          tuoi: this.dateToAge(parseISO(data.khachHang?.birthday)),
          gioiTinh: data.khachHang?.gender,
          tenBacSi: data.bacSi?.fullname
        };
        this.printService.onDataReady()
      });
    });
  }
}
