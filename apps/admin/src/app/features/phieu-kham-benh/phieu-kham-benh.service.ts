import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPhieuDichVu, IChiTietPhieuDichVu, ILichKham, IDichVu } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhieuKhamBenhService {

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

  create(phieuKhamBenh: object) {
    return this.http.post<IPhieuDichVu>('/api/phieu-dich-vu', phieuKhamBenh);
  }

  update(phieuKhamBenhId: number, phieuKhamBenh: object) {
    return this.http.put('/api/phieu-dich-vu/' + phieuKhamBenhId, phieuKhamBenh);
  }

  remove(phieuKhamBenhId: number) {
    return this.http.delete('/api/phieu-dich-vu/' + phieuKhamBenhId);
  }

  listThuoc(): Observable<IPhieuDichVu[]> {
    return this.http.get<IPhieuDichVu[]>('/api/thuoc');
  }

  listDichVu(): Observable<IDichVu[]>{
    return this.http.get<IDichVu[]>(`/api/dich-vu`);
  }

  createChiTiet(chitietPhieuKhamBenh: object){
    return this.http.post<IChiTietPhieuDichVu>('/api/chi-tiet-phieu-dich-vu', chitietPhieuKhamBenh);
  }

  updateChiTiet(chiTietPhieuKhamBenhId: number, chitietPhieuKhamBenh: object){
    return this.http.put<IChiTietPhieuDichVu>('/api/chi-tiet-phieu-dich-vu/' + chiTietPhieuKhamBenhId, chitietPhieuKhamBenh);
  }

  removeChiTiet(chiTietPhieuKhamBenhId: number) {
    return this.http.delete('/api/chi-tiet-phieu-dich-vu/' + chiTietPhieuKhamBenhId);
  }

  listChiTietPhieuKhamBenhByPhieuKhamBenhId(phieuKhamBenhId: any): Observable<IChiTietPhieuDichVu[]> {
    return this.http.get<IChiTietPhieuDichVu[]>('/api/chi-tiet-phieu-dich-vu/list-by-phieu-dich-vu-id/' + phieuKhamBenhId);
  }

  getLichKhamById(id: number) {
    return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  updateLichKham(lichKhamId: number, lichKham: object){
    return this.http.put<ILichKham>('/api/lich-kham/' + lichKhamId, lichKham);
  }
}
