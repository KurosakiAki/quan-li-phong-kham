import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChiTietThuoc, IDonThuoc, INhaCungCap, INhapKhoThuoc, IThuoc } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NhapKhoThuocService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<INhapKhoThuoc>('/api/nhap-kho-thuoc/' + id);
  }

  list(): Observable<INhapKhoThuoc[]> {
    return this.http.get<INhapKhoThuoc[]>('/api/nhap-kho-thuoc');
  }

  create(nhapKhoThuoc: object) {
    return this.http.post<INhapKhoThuoc>('/api/nhap-kho-thuoc', nhapKhoThuoc);
  }

  update(nhapKhoThuocId: number, nhapKhoThuoc: object) {
    return this.http.put('/api/nhap-kho-thuoc/' + nhapKhoThuocId, nhapKhoThuoc);
  }

  remove(nhapKhoThuocId: number) {
    return this.http.delete('/api/nhap-kho-thuoc/' + nhapKhoThuocId);
  }

  listThuoc(): Observable<IDonThuoc[]> {
    return this.http.get<IDonThuoc[]>('/api/thuoc');
  }

  listChiTietThuocByNhapKhoThuocId(nhapKhoThuocId: any): Observable<IChiTietThuoc[]> {
    return this.http.get<IChiTietThuoc[]>('/api/chi-tiet-thuoc/list-by-nhap-kho-id/' + nhapKhoThuocId);
  }

  listNhaCungCap(): Observable<INhaCungCap[]> {
    return this.http.get<INhaCungCap[]>('/api/nha-cung-cap');
  }

  getNhaCungCap(nhaCungCapId: number) {
    return this.http.get<INhaCungCap>('/api/nha-cung-cap/' + nhaCungCapId);
  }

  createChiTiet(chitietThuoc: object){
    return this.http.post<IChiTietThuoc>('/api/chi-tiet-thuoc', chitietThuoc);
  }

  updateChiTietThuoc(chiTietThuocId: number, chiTietThuoc: object) {
    return this.http.put('/api/chi-tiet-thuoc/' + chiTietThuocId, chiTietThuoc);
  }

  removeChiTietThuoc(chiTietThuocId: number) {
    return this.http.delete('/api/chi-tiet-thuoc/' + chiTietThuocId);
  }

  updateTonKho(thuocId: number, thuoc: object) {
    return this.http.put('/api/thuoc/' + thuocId, thuoc);
  }
}
