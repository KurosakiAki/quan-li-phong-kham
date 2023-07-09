import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { IChangePassword, UserRoleEnum } from '@api-interfaces';
import { LocalStorageService } from '../../common/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    currentUser: any;
    role?: UserRoleEnum;

    constructor(
        private http: HttpClient,
        private storageService: LocalStorageService
    ) { }

    getCurrentuser() {
        if (this.currentUser) return of(this.currentUser);
        return this.http.get('/api/auth/me').pipe(
            tap((data: any) => {
                this.currentUser = data;
                this.role = data.userRoleCode;
            })
        );
    }

    /**
     * Login
     * @param data
     * @returns
     */
    login(data: { username: string, password: string }) {
        return this.http.post('/api/auth/login', data)
            .pipe(
                tap((data: any) => {
                    this.storageService.setAccessToken(data.access_token);
                }))
    }

    /**
     *
     * @returns
     */
    logout() {
        this.currentUser = null;
        this.storageService.removeAccessToken();
    }

    /**
     *
     * @param data
     * @returns
     */
    changePassword(userId: number, data: IChangePassword) {
        return this.http.post(`/api/auth/${userId}/change-password`, data);
    }

    /**
     *
     * @param data
     * @returns
     */
    forgotPassword(data: { email: string }) {
        return this.http.post('/api/auth/forgot-password', data);
    }

    /**
     *
     * @param data
     * @returns
     */
     resetPassword(data: { password: string, token: string }, ) {
        return this.http.post('/api/user/reset-my-password', data);
    }

    /**
     * 
     * @param newPassword 
     * @returns 
     */
    changeMyPassword(newPassword: any) {
        return this.http.post(`/api/user/change-my-password`, newPassword);
    }

    /**
     *
     * @param data
     * @returns
     */
    verifyCode(data: { referenceId: string }) {
        return this.http.post('/api/auth/verify-code', data);
    }

    /**
     *
     * @param data
     * @returns
     */
    register(data: { username: string, userRoleCode: string, password: string, token: string }, ) {
        return this.http.post('/api/user/register', data);
    }
}