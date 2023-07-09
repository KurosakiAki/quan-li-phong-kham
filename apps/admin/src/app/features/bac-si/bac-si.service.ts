import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBacSi } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BacSiService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IBacSi>('/api/bac-si/' + id);
  }

  list(): Observable<IBacSi[]> {
    return this.http.get<IBacSi[]>('/api/bac-si');
  }

  create(bacSi: object) {
    return this.http.post<IBacSi>('/api/bac-si', bacSi);
  }

  update(bacSiId: number, bacSi: object) {
    return this.http.put('/api/bac-si/' + bacSiId, bacSi);
  }

  remove(bacSiId: number) {
    return this.http.delete('/api/bac-si/' + bacSiId);
  }
}
