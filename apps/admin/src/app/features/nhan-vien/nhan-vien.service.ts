import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INhanVien } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NhanVienService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<INhanVien>('/api/nhan-vien/' + id);
  }

  list(): Observable<INhanVien[]> {
    return this.http.get<INhanVien[]>('/api/nhan-vien');
  }

  create(nhanVien: object) {
    return this.http.post<INhanVien>('/api/nhan-vien', nhanVien);
  }

  update(nhanVienId: number, nhanVien: object) {
    return this.http.put('/api/nhan-vien/' + nhanVienId, nhanVien);
  }

  remove(nhanVienId: number) {
    return this.http.delete('/api/nhan-vien/' + nhanVienId);
  }
}
