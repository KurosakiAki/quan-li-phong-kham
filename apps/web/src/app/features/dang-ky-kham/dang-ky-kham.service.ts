import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IChuyenKhoa, ILichKham, IUser } from '@api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class DangKyKhamService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
      return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  listByBacSi(bacSiId: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>('/api/lich-kham/list-by-bac-si/' + bacSiId);
  }

  create(lichKham: object) {
    console.log(lichKham);
    return this.http.post<ILichKham>('/api/lich-kham', lichKham);
  }

  chuyenKhoaList(): Observable<IChuyenKhoa[]> {
    return this.http.get<IChuyenKhoa[]>('/api/chuyen-khoa');
  }

  bacSiList(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/bac-si');
  }
}
