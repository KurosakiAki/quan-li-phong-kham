import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBenhNhan, IUser } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
      private http: HttpClient,
      private translate: TranslateService
  ) {}

  getUserInfo(id: number, role: string) {
    return this.http.get<any>(`/api/${role}/` + id);
  }

  updateProfile(user: object){
    return this.http.post<IUser>('/api/user/update-profile', user);
  }

  updateUserInfo(roleId: number, role: string, data: any){
    return this.http.put<any>(`/api/${role}/` + roleId, data);
  }
}
