import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBacSi, IBenhNhan, IChiTietPhieuDichVu, IDichVu, ILichKham, IPhieuDichVu } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LichKhamService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
      return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  list(bacSiId?: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>(`/api/lich-kham?bacSiId=${bacSiId}`);
  }

  create(lichKham: object) {
    return this.http.post<ILichKham>('/api/lich-kham', lichKham);
  }

  update(lichKhamId: number, lichKham: object) {
    return this.http.put('/api/lich-kham/' + lichKhamId, lichKham);
  }

  remove(lichKhamId: number) {
    return this.http.delete('/api/lich-kham/' + lichKhamId);
  }

  confirmLichKham(data: any) {
    return this.http.post('/api/lich-kham/confirm-lich-kham', data);
  }

  listBenhNhan(): Observable<IBenhNhan[]>{
    return this.http.get<IBenhNhan[]>(`/api/khach-hang`);
  }

  listBacSi(): Observable<IBacSi[]>{
    return this.http.get<IBacSi[]>(`/api/bac-si`);
  }

  listDichVu(): Observable<IDichVu[]>{
    return this.http.get<IDichVu[]>(`/api/dich-vu`);
  }

  listLichKhamByBacSi(bacSiId: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>('/api/lich-kham/list-by-bac-si/' + bacSiId);
  }

  createPhieuDichVu(phieuDichVu: object) {
    return this.http.post<IPhieuDichVu>('/api/phieu-dich-vu', phieuDichVu);
  }

  createChiTietPhieuDichVu(chiTietPhieuDichVu: object) {
    return this.http.post<IChiTietPhieuDichVu>('/api/chi-tiet-phieu-dich-vu', chiTietPhieuDichVu);
  }
}
