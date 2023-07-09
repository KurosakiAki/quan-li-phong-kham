import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseISO } from 'date-fns';
import { forkJoin } from 'rxjs';
import { PrintService } from '../print.service';

@Component({
  selector: 'ttti-mau-nhap-kho',
  templateUrl: './mau-nhap-kho.component.html',
  styleUrls: ['./mau-nhap-kho.component.scss'],
})
export class MauNhapKhoComponent implements OnInit {
  id: number;
  nhapKhoThuoc: any;
  chiTietThuoc: any[] = [];

  constructor (
    route: ActivatedRoute,
    private printService: PrintService
  ) {
    this.id = route.snapshot.params['id'];
  }

  ngOnInit() {
    const getNhapKhoThuoc = this.printService.getNhapKhoThuoc(this.id);
    const getChiTietThuoc = this.printService.listChiTietThuoc(this.id);

    forkJoin([getNhapKhoThuoc, getChiTietThuoc]).subscribe(results => {
      this.nhapKhoThuoc = {
        ...results[0],
        tenNhaCungCap: results[0].nhaCungCap?.fullname
      };

      this.chiTietThuoc = results[1];
      this.chiTietThuoc.forEach((item: any) => {
        item.tenThuoc = item.thuoc?.tenThuoc;
        item.donVi = item.thuoc?.donVi;
      });
      
      this.printService.getUser(this.nhapKhoThuoc.updatedUser).subscribe(data =>{
        this.nhapKhoThuoc = {
          ...this.nhapKhoThuoc,
          tenUser: data.fullname
        }
        this.printService.onDataReady()
      })
    });
  }
}
