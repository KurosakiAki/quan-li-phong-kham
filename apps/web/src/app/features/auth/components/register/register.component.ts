import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { faLock, faUser } from '@fortawesome/pro-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { LocalStorageService } from '../../../../common/services/local-storage.service';
import { AppTranslateService } from '../../../../common/services/app-translate.service';
import { AppState } from '../../../../common/services/app-state.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { AuthState, AuthActions } from '../../store';

@Component({
  selector: 'ttti-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  token: string;
  register: any;

  registerForm!: FormGroup;

  faArrowLeft = faArrowLeft;
  faUser = faUser;
  faLock = faLock;

  destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private appTranslateService: AppTranslateService,
    private router: Router,
    private actRoute: ActivatedRoute,
    public appState: AppState,
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private update$: Actions
  ) {
    this.token = this.actRoute.snapshot.params['token'];

    this.registerForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.update$.pipe(
      ofType(AuthActions.registerSuccessed, AuthActions.registerFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.registerSuccessed.type) {
          this.toastrService.success(this.translateService.instant('Đăng ký thành công'));
          this.router.navigate(['/auth', 'login']);
        } else {
          if (payload.error.error?.message === 'Token does not exist') {
            this.toastrService.error(this.translateService.instant('Sai đường dẫn đăng ký tài khoản'));
          } else {
            this.toastrService.error(this.translateService.instant(payload.error.error?.message));
          }
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
    this.registerForm.markAllAsTouched();

    this.register = {
      ...this.registerForm.value,
      userRoleCode: 'PATIENT',
      token: this.token,
    }

    if(this.registerForm.valid && (this.registerForm.value.password === this.registerForm.value.confirmPassword)){
      this.store.dispatch(AuthActions.register(
        {data: this.register}
      ));
    }
    else return;
  }

  goBack(){
    this.router.navigate(['/']);
  }
}
