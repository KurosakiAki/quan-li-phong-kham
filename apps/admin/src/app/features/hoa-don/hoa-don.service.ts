import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBenhNhan, IChiTietHoaDon, IChiTietThuoc, IDichVu, IDonThuoc, IHoaDon, IPhieuDichVu } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HoaDonService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IHoaDon>('/api/hoa-don/' + id);
  }

  list(): Observable<IHoaDon[]> {
    return this.http.get<IHoaDon[]>('/api/hoa-don');
  }

  create(hoaDon: object) {
    return this.http.post<IHoaDon>('/api/hoa-don', hoaDon);
  }

  update(hoaDonId: number, hoaDon: object) {
    return this.http.put('/api/hoa-don/' + hoaDonId, hoaDon);
  }

  remove(hoaDonId: number) {
    return this.http.delete('/api/hoa-don/' + hoaDonId);
  }

  getDonThuocByMaHoaDon(maHoaDon: string) {
    return this.http.get<IDonThuoc>(`/api/don-thuoc/ma-hoa-don?maHoaDon=${maHoaDon}`);
  }

  getPhieuDichVuByMaHoaDon(maHoaDon: string) {
    return this.http.get<IPhieuDichVu>(`/api/phieu-dich-vu/ma-hoa-don?maHoaDon=${maHoaDon}`);
  }

  updateDonThuoc(donThuocId: number, donThuoc: object) {
    return this.http.put('/api/don-thuoc/' + donThuocId, donThuoc);
  }

  updatePhieuDichVu(phieuDichVuId: number, phieuDichVu: object) {
    return this.http.put('/api/phieu-dich-vu/' + phieuDichVuId, phieuDichVu);
  }

  createChiTiet(chiTietHoaDon: object){
    return this.http.post<IChiTietHoaDon>('/api/chi-tiet-hoa-don', chiTietHoaDon);
  }

  listChiTietHoaDonByHoaDonId(nhapKhoThuocId: any): Observable<IChiTietHoaDon[]> {
    return this.http.get<IChiTietHoaDon[]>('/api/chi-tiet-hoa-don/list-by-hoa-don-id/' + nhapKhoThuocId);
  }

  listChiTietThuocByThuocId(thuocId: any): Observable<IChiTietThuoc[]> {
    return this.http.get<IChiTietThuoc[]>('/api/chi-tiet-thuoc/list-da-kiem-dinh/' + thuocId);
  }

  listThuoc(): Observable<IDonThuoc[]> {
    return this.http.get<IDonThuoc[]>('/api/thuoc');
  }

  listDichVu(): Observable<IDichVu[]> {
    return this.http.get<IDichVu[]>('/api/dich-vu');
  }

  listKhachHang() {
    return this.http.get<IBenhNhan>('/api/khach-hang');
  }

  updateChiTietHoaDon(chiTietThuocId: number, chiTietThuoc: object) {
    return this.http.put('/api/chi-tiet-hoa-don/' + chiTietThuocId, chiTietThuoc);
  }

  removeChiTietHoaDon(chiTietThuocId: number) {
    return this.http.delete('/api/chi-tiet-hoa-don/' + chiTietThuocId);
  }

  updateTonKho(thuocId: number, thuoc: object) {
    return this.http.put('/api/thuoc/' + thuocId, thuoc);
  }

  updateChiTietThuoc(chiTietThuocId: number, chiTietThuoc: object) {
    return this.http.put('/api/chi-tiet-thuoc/' + chiTietThuocId, chiTietThuoc);
  }
}
