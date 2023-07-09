import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChiTietThuoc } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TinhTrangLoThuocService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IChiTietThuoc>('/api/chi-tiet-thuoc/' + id);
  }

  list(): Observable<IChiTietThuoc[]> {
    return this.http.get<IChiTietThuoc[]>('/api/chi-tiet-thuoc');
  }

  create(chiTietThuoc: object) {
    return this.http.post<IChiTietThuoc>('/api/chi-tiet-thuoc', chiTietThuoc);
  }

  update(chiTietThuocId: number, chiTietThuoc: object) {
    return this.http.put('/api/chi-tiet-thuoc/' + chiTietThuocId, chiTietThuoc);
  }

  remove(chiTietThuocId: number) {
    return this.http.delete('/api/chi-tiet-thuoc/' + chiTietThuocId);
  }
}
