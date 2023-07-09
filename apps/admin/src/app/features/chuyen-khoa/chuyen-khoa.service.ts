import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChuyenKhoa } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChuyenKhoaService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IChuyenKhoa>('/api/chuyen-khoa/' + id);
  }

  list(): Observable<IChuyenKhoa[]> {
    return this.http.get<IChuyenKhoa[]>('/api/chuyen-khoa');
  }

  create(chuyenKhoa: object) {
    return this.http.post<IChuyenKhoa>('/api/chuyen-khoa', chuyenKhoa);
  }

  update(chuyenKhoaId: number, chuyenKhoa: object) {
    return this.http.put('/api/chuyen-khoa/' + chuyenKhoaId, chuyenKhoa);
  }

  remove(chuyenKhoaId: number) {
    return this.http.delete('/api/chuyen-khoa/' + chuyenKhoaId);
  }
}
