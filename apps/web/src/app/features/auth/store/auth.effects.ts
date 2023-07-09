import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, map, catchError, of, EMPTY, filter } from 'rxjs';
import { AuthActions, AuthSelectors } from '.';
import { AuthService } from '../auth.service';
import { AuthState } from './auth.reducer';



@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
    private AuthService: AuthService,
    private store: Store<AuthState>) {}

    changePassword$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.changePassword),
        mergeMap(({id, newPassword}) => this.AuthService.changePassword(id, newPassword)
          .pipe(
            map((item) => AuthActions.changePasswordSuccessed()),
            catchError((error) => of(AuthActions.changePasswordFailed({error})))
          )
        )
      )
    })

    forgetPassword$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.forgotPassword),
        mergeMap(({data}) => this.AuthService.forgotPassword(data)
          .pipe(
            map(() => AuthActions.forgotPasswordSuccessed()),
            catchError((error) => of(AuthActions.forgotPasswordFailed({error})))
          )
        )
      )
    })

    resetPassword$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.resetPassword),
        mergeMap(({data}) => this.AuthService.resetPassword(data)
          .pipe(
            map(() => AuthActions.resetPasswordSuccessed()),
            catchError((error) => of(AuthActions.resetPasswordFailed({error})))
          )
        )
      )
    })

    verifyCode$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.verifyCode),
        mergeMap(({data}) => this.AuthService.verifyCode(data)
          .pipe(
            map(() => AuthActions.verifyCodeSuccessed()),
            catchError((error) => of(AuthActions.verifyCodeFailed({error})))
          )
        )
      )
    })

    register$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.register),
        mergeMap(({data}) => this.AuthService.register(data)
          .pipe(
            map(() => AuthActions.registerSuccessed()),
            catchError((error) => of(AuthActions.registerFailed({error})))
          )
        )
      )
    })

    login$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({data}) => this.AuthService.login(data)
          .pipe(
            map(() => AuthActions.loginSuccessed()),
            catchError((error) => of(AuthActions.loginFailed({error})))
          )
        )
      )
    })

    logout$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        mergeMap(() => {
          this.AuthService.logout();
          return of(AuthActions.logoutSuccess())
        })
      )
    });

}
