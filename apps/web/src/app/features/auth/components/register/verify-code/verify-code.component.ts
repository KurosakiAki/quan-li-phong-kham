import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { faLock, faUser } from '@fortawesome/pro-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'apps/web/src/app/common/services/local-storage.service';
import { AppTranslateService } from 'apps/web/src/app/common/services/app-translate.service';
import { AppState } from 'apps/web/src/app/common/services/app-state.service';
import { AuthState, AuthActions } from '../../../store';

@Component({
  selector: 'ttti-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  verify: any;

  verifyForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMsg = null;
  isSubmitted = false;

  faArrowLeft = faArrowLeft;
  faUser = faUser;
  faLock = faLock;

  destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private appTranslateService: AppTranslateService,
    public appState: AppState,
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private update$: Actions,
    private route: Router
  ) {
    this.verifyForm = this.fb.group({
      referenceId: new FormControl('', [Validators.required])
    });

    this.update$.pipe(
      ofType(AuthActions.verifyCodeSuccessed, AuthActions.verifyCodeFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.verifyCodeSuccessed.type) {
          this.toastrService.success(this.translateService.instant('Gửi thành công! Vui lòng kiểm tra hộp thư email của bạn'));
        } else {
          if (payload.error.error?.message === 'Code does not exist') {
            this.toastrService.error(this.translateService.instant('Mã bệnh nhân không tồn tại'));
          } 
          else if (payload.error.error?.message === 'An account is already registered with your code') {
            this.toastrService.error(this.translateService.instant('Mã bệnh nhân này đã có tài khoản'));
          }
          else {
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
    if(this.verifyForm.valid){
      this.store.dispatch(AuthActions.verifyCode({data: this.verifyForm.value}));
    }
    else return;
  }

  goBack(){
    this.route.navigate(['/']);
  }
}
