import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IThuoc } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThuocService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IThuoc>('/api/thuoc/' + id);
  }

  list(): Observable<IThuoc[]> {
    return this.http.get<IThuoc[]>('/api/thuoc');
  }

  create(thuoc: object) {
    return this.http.post<IThuoc>('/api/thuoc', thuoc);
  }

  update(thuocId: number, thuoc: object) {
    return this.http.put('/api/thuoc/' + thuocId, thuoc);
  }

  remove(thuocId: number) {
    return this.http.delete('/api/thuoc/' + thuocId);
  }
}
