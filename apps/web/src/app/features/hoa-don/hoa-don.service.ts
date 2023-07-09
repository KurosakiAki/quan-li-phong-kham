import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChiTietHoaDon, IHoaDon } from '@api-interfaces';
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

  list(khachHangId: number): Observable<IHoaDon[]> {
    return this.http.get<IHoaDon[]>(`/api/hoa-don?khachHangId=${khachHangId}`);
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

  listChiTietHoaDonByHoaDonId(hoaDonId: any): Observable<IChiTietHoaDon[]> {
    return this.http.get<IChiTietHoaDon[]>('/api/chi-tiet-hoa-don/list-by-hoa-don-id/' + hoaDonId);
  }
}
