import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBenhNhan, IChiTietDonThuoc, IDichVu, IDonThuoc, ILichKham } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonThuocService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IDonThuoc>('/api/don-thuoc/' + id);
  }

  list(): Observable<IDonThuoc[]> {
    return this.http.get<IDonThuoc[]>('/api/don-thuoc');
  }

  create(donThuoc: object) {
    return this.http.post<IDonThuoc>('/api/don-thuoc', donThuoc);
  }

  update(donThuocId: number, donThuoc: object) {
    return this.http.put('/api/don-thuoc/' + donThuocId, donThuoc);
  }

  remove(donThuocId: number) {
    return this.http.delete('/api/don-thuoc/' + donThuocId);
  }

  listThuoc(): Observable<IDonThuoc[]> {
    return this.http.get<IDonThuoc[]>('/api/thuoc');
  }

  listDichVu(): Observable<IDichVu[]> {
    return this.http.get<IDichVu[]>('/api/dich-vu');
  }

  createChiTiet(chitietDonThuoc: object){
    return this.http.post<IChiTietDonThuoc>('/api/chi-tiet-don-thuoc', chitietDonThuoc);
  }

  updateChiTiet(chiTietDonThuocId: number, chitietDonThuoc: object){
    return this.http.put<IChiTietDonThuoc>('/api/chi-tiet-don-thuoc/' + chiTietDonThuocId, chitietDonThuoc);
  }

  removeChiTiet(chiTietDonThuocId: number) {
    return this.http.delete('/api/chi-tiet-don-thuoc/' + chiTietDonThuocId);
  }

  listChiTietDonThuocByDonThuocId(donThuocId: any): Observable<IChiTietDonThuoc[]> {
    return this.http.get<IChiTietDonThuoc[]>('/api/chi-tiet-don-thuoc/list-by-don-thuoc-id/' + donThuocId);
  }

  getLichKhamById(id: number) {
    return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }
}
