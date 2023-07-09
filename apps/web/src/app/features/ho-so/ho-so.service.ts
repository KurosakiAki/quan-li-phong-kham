import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILichKham, IDonThuoc, IChiTietDonThuoc, IPhieuDichVu, IChiTietPhieuDichVu, IBenhNhan, IUser } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HoSoService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  get(id: number) {
    return this.http.get<IBenhNhan>('/api/khach-hang/' + id);
  }

  listLichKham(khachHangId?: number): Observable<ILichKham[]> {
    return this.http.get<ILichKham[]>(`/api/lich-kham?khachHangId=${khachHangId}`);
  }

  getDonThuoc(id: number) {
    return this.http.get<IDonThuoc>('/api/don-thuoc/lich-kham/' + id);
  }

  listChiTietDonThuoc(id: number){
    return this.http.get<IChiTietDonThuoc>(`/api/chi-tiet-don-thuoc?donThuocId=${id}`);
  }

  listPhieuDichVu(lichKhamId?: number): Observable<IPhieuDichVu[]> {
    return this.http.get<IPhieuDichVu[]>(`/api/phieu-dich-vu?lichKhamId=${lichKhamId}`);
  }

  listChiTietPhieuDichVu(id: number){
    return this.http.get<IChiTietPhieuDichVu>(`/api/chi-tiet-phieu-dich-vu?phieuDichVuId=${id}`);
  }

  updateProfile(user: object){
    return this.http.post<IUser>('/api/user/update-profile', user);
  }

  updateUserInfo(roleId: number, data: any){
    return this.http.put<IBenhNhan>('/api/khach-hang/' + roleId, data);
  }
}
