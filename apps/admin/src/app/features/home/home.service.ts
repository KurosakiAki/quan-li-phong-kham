import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILichKham } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
      return this.http.get<ILichKham>('/api/lich-kham/' + id);
  }

  list(): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>('/api/lich-kham');
  }
}
