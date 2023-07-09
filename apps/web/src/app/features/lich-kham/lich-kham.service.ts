import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILichKham } from '@api-interfaces';
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

  list(khachHangId?: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>(`/api/lich-kham?khachHangId=${khachHangId}`);
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
}
