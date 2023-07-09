import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse  } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';



@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

    constructor(private localStorageService: LocalStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.localStorageService.getAccessToken();

        if (token) {

            let headers = req.headers
                // Set access token to http request
                .set('Authorization', 'Bearer ' + token);


            const authReq = req.clone({ headers });
            return next.handle(authReq).pipe(
                // tap(evt => this.onResponse(evt)),
                catchError(evt => this.onResponse(evt))
            );
        }

        return next.handle(req).pipe(
            // tap(evt => this.onResponse(evt)),
            catchError(evt => this.onResponse(evt))
        );
    }

    onResponse(evt: any) {
        if (evt instanceof HttpErrorResponse) {
            if (evt.status === 401 && evt.url?.indexOf(document.domain) !== -1 && !evt.url?.includes('/auth/me')) {
                // Go to login page
                window.localStorage.clear();
                window.location.href = `/auth/login`;
            }
        }
        return throwError(evt);
    }
}
