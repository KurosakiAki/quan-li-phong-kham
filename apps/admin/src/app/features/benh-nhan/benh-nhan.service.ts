import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBenhNhan, IChiTietDonThuoc, IChiTietPhieuDichVu, IDonThuoc, ILichKham, IPhieuDichVu } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BenhNhanService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IBenhNhan>('/api/khach-hang/' + id);
  }

  list(): Observable<IBenhNhan[]> {
    return this.http.get<IBenhNhan[]>('/api/khach-hang');
  }

  create(benhNhan: object) {
    return this.http.post<IBenhNhan>('/api/khach-hang', benhNhan);
  }

  update(benhNhanId: number, benhNhan: object) {
    return this.http.put('/api/khach-hang/' + benhNhanId, benhNhan);
  }

  remove(benhNhanId: number) {
    return this.http.delete('/api/khach-hang/' + benhNhanId);
  }

  listLichKham(khachHangId?: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>(`/api/lich-kham?khachHangId=${khachHangId}`);
  }

  getDonThuoc(id: number) {
    return this.http.get<IDonThuoc>('/api/don-thuoc/lich-kham/' + id);
  }

  listChiTietDonThuoc(id: number){
    return this.http.get<IChiTietDonThuoc>(`/api/chi-tiet-don-thuoc?donThuocId=${id}`);
  }

  listPhieuDichVu(lichKhamId?: number): Observable<IPhieuDichVu[]> {
    return this.http.get<IPhieuDichVu[]>(`/api/phieu-dich-vu?lichKhamId=${lichKhamId}`);
  }

  listChiTietPhieuDichVu(id: number){
    return this.http.get<IChiTietPhieuDichVu>(`/api/chi-tiet-phieu-dich-vu?phieuDichVuId=${id}`);
  }
}
