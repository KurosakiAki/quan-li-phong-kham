import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IChangePassword, IChuyenKhoa, IUser, IUserRole, UserRoleEnum } from '@api-interfaces';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class UserService {

    columnsDescription: any = {};

    modalSubmitted$ = new Subject();

    constructor(
        private http: HttpClient,
        private translate: TranslateService
    ) { 
        this.columnsDescription = {
            fullname: this.translate.instant('Tên'),
            phone: this.translate.instant('Điện thoại'),
            address: this.translate.instant('Địa chỉ'),
            email: this.translate.instant('Email'),
            userRoleCode: this.translate.instant('Vai trò'),
            birthday: this.translate.instant('Ngày sinh'),
            gender: this.translate.instant('Giới tính'),
            username: this.translate.instant('Tài khoản'),
            password: this.translate.instant('Mật khẩu')
        }
    }

    get(id: number) {
        return this.http.get<IUser>('/api/user/' + id);
    }
    
    list(): Observable<IUser[]> {
        return this.http.get<IUser[]>('/api/user');
    }

    create(user: IUser) {
        return this.http.post<IUser>('/api/user', user);
    }

    update(userId: number, user: object) {
        return this.http.put<IUser>('/api/user/' + userId, user);
    }

    remove(userId: number) {
        return this.http.delete('/api/user/' + userId);
    }

    chuyenKhoaList(): Observable<IChuyenKhoa[]> {
        return this.http.get<IChuyenKhoa[]>('/api/chuyen-khoa');
    }

    roleList(): Observable<IUserRole[]> {
        return this.http.get<IUserRole[]>('/api/user-role');
    }

    changePassword(userId: number, newPassword: IChangePassword) {
        return this.http.post<IUser>(`/api/user/${userId}/change-password`, newPassword);
    }

    convertRole(userRoleCode: string){
        if(userRoleCode === UserRoleEnum.ADMIN){
            return 'admin';
        }
        else if(userRoleCode === UserRoleEnum.DOCTOR){
            return 'bac-si';
        }
        else if(userRoleCode === UserRoleEnum.STAFF){
            return 'nhan-vien';
        }
        else {
            return 'khach-hang'
        }
    }

    listParties(role: string): Observable<IUser[]>{
        return this.http.get<IUser[]>(`/api/${role}`);
    }

    updateUserInfo(roleId: number, role: string, data: any){
        return this.http.put<any>(`/api/${role}/` + roleId, data);
    }

    createUserInfo(role: string, data: any){
        return this.http.post<any>(`/api/${role}/`, data);
    }

    removeUserInfo(roleId: number, role: string){
        return this.http.delete(`/api/${role}/` + roleId);
    }
}