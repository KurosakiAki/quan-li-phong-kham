import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { faLock, faUser } from '@fortawesome/pro-regular-svg-icons';
import { LocalStorageService } from '../../../../common/services/local-storage.service';
import { AuthService } from '../../auth.service';
import { AppTranslateService } from '../../../../common/services/app-translate.service';
import { AppState } from '../../../../common/services/app-state.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { AuthState, AuthActions } from '../../store';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMsg = null;


  faUser = faUser;
  faLock = faLock;

  destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private appTranslateService: AppTranslateService,
    private router: Router,
    public appState: AppState,
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private update$: Actions
  ) {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.update$.pipe(
      ofType(AuthActions.loginSuccessed, AuthActions.loginFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.loginSuccessed.type) {
          const urlFrom = this.localStorageService.getUrlFromThenDel();
          if (urlFrom) {
            this.router.navigate([urlFrom])
          } else {
            window.location.href = '/';
          }
        } else {
          this.toastrService.error(this.translateService.instant('Tài khoản hoặc mật khẩu sai'));
        }
    })
  }

  ngOnInit() {

  }

  /**
     * Select language
     * @param {'vi' | 'en'} lang Language
  */
  selectLang(lang: string) {
    this.appTranslateService.selectLang(lang);
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.store.dispatch(AuthActions.login({data: this.loginForm.value}));
    }
    else return;
  }
}
