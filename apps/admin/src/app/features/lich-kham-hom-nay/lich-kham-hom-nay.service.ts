import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDichVu, ILichKham } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LichKhamHomNayService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  list(id: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>('/api/lich-kham/list-by-bac-si/' + id);
  }

  listDichVu(): Observable<IDichVu[]>{
    return this.http.get<IDichVu[]>(`/api/dich-vu`);
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
