import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDichVu } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DichVuService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IDichVu>('/api/dich-vu/' + id);
  }

  list(): Observable<IDichVu[]> {
    return this.http.get<IDichVu[]>('/api/dich-vu');
  }

  create(dichVu: object) {
    return this.http.post<IDichVu>('/api/dich-vu', dichVu);
  }

  update(dichVuId: number, dichVu: object) {
    return this.http.put('/api/dich-vu/' + dichVuId, dichVu);
  }

  remove(dichVuId: number) {
    return this.http.delete('/api/dich-vu/' + dichVuId);
  }
}
