import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INhaCungCap } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NhaCungCapService {
  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<INhaCungCap>('/api/nha-cung-cap/' + id);
  }

  list(): Observable<INhaCungCap[]> {
    return this.http.get<INhaCungCap[]>('/api/nha-cung-cap');
  }

  create(nhaCungCap: object) {
    return this.http.post<INhaCungCap>('/api/nha-cung-cap', nhaCungCap);
  }

  update(nhaCungCapId: number, nhaCungCap: object) {
    return this.http.put('/api/nha-cung-cap/' + nhaCungCapId, nhaCungCap);
  }

  remove(nhaCungCapId: number) {
    return this.http.delete('/api/nha-cung-cap/' + nhaCungCapId);
  }
}
