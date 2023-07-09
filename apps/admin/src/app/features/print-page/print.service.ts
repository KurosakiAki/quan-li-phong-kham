import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IChiTietDonThuoc, IChiTietHoaDon, IChiTietPhieuDichVu, IChiTietThuoc, IDonThuoc, ILichKham, INhapKhoThuoc, IPhieuDichVu, IUser } from '@api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  printDocument(documentName: string, documentData: number) {
    this.isPrinting = true;
    this.router.navigate(['/',
      { 
        outlets: {
        'print': ['print', documentName, documentData]
        }
      }
    ], { skipLocationChange: true });
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null }}], { skipLocationChange: true });
    });
  }

  listChiTietDonThuoc(id: any): Observable<IChiTietDonThuoc[]> {
    return this.http.get<IChiTietDonThuoc[]>('/api/chi-tiet-don-thuoc/list-by-don-thuoc-id/' + id);
  }

  listChiTietPhieuDichVu(id: any): Observable<IChiTietPhieuDichVu[]> {
    return this.http.get<IChiTietPhieuDichVu[]>('/api/chi-tiet-phieu-dich-vu/list-by-phieu-dich-vu-id/' + id);
  }

  listChiTietThuoc(id: any): Observable<IChiTietThuoc[]> {
    return this.http.get<IChiTietThuoc[]>('/api/chi-tiet-thuoc/list-by-nhap-kho-id/' + id);
  }

  listChiTietHoaDon(id: any): Observable<IChiTietHoaDon[]> {
    return this.http.get<IChiTietHoaDon[]>('/api/chi-tiet-hoa-don/list-by-hoa-don-id/' + id);
  }

  getDonThuoc(id: number) {
    return this.http.get<IDonThuoc>('/api/don-thuoc/' + id);
  }

  getPhieuDichVu(id: number) {
    return this.http.get<IPhieuDichVu>('/api/phieu-dich-vu/' + id);
  }

  getLichKham(id: number) {
    return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  getNhapKhoThuoc(id: number) {
    return this.http.get<any>('/api/nhap-kho-thuoc/' + id);
  }

  getHoaDon(id: number){
    return this.http.get<any>('/api/hoa-don/' + id);
  }

  getUser(id: number) {
    return this.http.get<IUser>('/api/user/name/' + id);
  }

  getKhachHang(id: number) {
    return this.http.get<IUser>('/api/khach-hang/' + id);
  };
}
