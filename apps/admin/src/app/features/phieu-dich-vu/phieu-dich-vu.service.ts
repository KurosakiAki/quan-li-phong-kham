import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChiTietPhieuDichVu, IDichVu, ILichKham, IPhieuDichVu, IThuoc } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhieuDichVuService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IPhieuDichVu>('/api/phieu-dich-vu/' + id);
  }

  list(): Observable<IPhieuDichVu[]> {
    return this.http.get<IPhieuDichVu[]>('/api/phieu-dich-vu');
  }

  create(phieuDichVu: object) {
    return this.http.post<IPhieuDichVu>('/api/phieu-dich-vu', phieuDichVu);
  }

  update(phieuDichVuId: number, phieuDichVu: object) {
    return this.http.put('/api/phieu-dich-vu/' + phieuDichVuId, phieuDichVu);
  }

  remove(phieuDichVuId: number) {
    return this.http.delete('/api/phieu-dich-vu/' + phieuDichVuId);
  }

  listThuoc(): Observable<IThuoc[]> {
    return this.http.get<IThuoc[]>('/api/thuoc');
  }

  listDichVu(): Observable<IDichVu[]> {
    return this.http.get<IDichVu[]>('/api/dich-vu');
  }

  createChiTiet(chitietPhieuDichVu: object){
    return this.http.post<IChiTietPhieuDichVu>('/api/chi-tiet-phieu-dich-vu', chitietPhieuDichVu);
  }

  updateChiTiet(chiTietPhieuDichVuId: number, chitietPhieuDichVu: object){
    return this.http.put<IChiTietPhieuDichVu>('/api/chi-tiet-phieu-dich-vu/' + chiTietPhieuDichVuId, chitietPhieuDichVu);
  }

  removeChiTiet(chiTietPhieuDichVuId: number) {
    return this.http.delete('/api/chi-tiet-phieu-dich-vu/' + chiTietPhieuDichVuId);
  }

  listChiTietPhieuDichVuByPhieuDichVuId(phieuDichVuId: any): Observable<IChiTietPhieuDichVu[]> {
    return this.http.get<IChiTietPhieuDichVu[]>('/api/chi-tiet-phieu-dich-vu/list-by-phieu-dich-vu-id/' + phieuDichVuId);
  }

  getLichKhamById(id: number) {
    return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }
}
