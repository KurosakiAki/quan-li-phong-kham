import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthActions, AuthState } from '../../store';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  forgotPassword: any;

  submitted = false;
  faEnvelope = faEnvelope;
  destroy$ = new Subject();
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private store: Store<AuthState>,
    private update$: Actions
  ) { 
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
    });

    this.update$.pipe(
      ofType(AuthActions.forgotPasswordSuccessed, AuthActions.forgotPasswordFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.forgotPasswordSuccessed.type) {
          this.toastrService.success(this.translateService.instant('Gửi thành công! Vui lòng kiểm tra hộp thư email của bạn'));
        } else {
          if (payload.error.error?.message === 'Username does not exist') {
            this.toastrService.error(this.translateService.instant('Username không tồn tại'));
          } else {
            this.toastrService.error(this.translateService.instant(payload.error.error?.message));
          }
        }
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    this.forgotPassword = {
      ...this.forgotPasswordForm.value,
      role: 'PATIENT'
    }
    if(this.forgotPasswordForm.valid){
      this.store.dispatch(AuthActions.forgotPassword({data: this.forgotPassword}));
    }
    else return;
    this.submitted = true;
  }
  get f() {
    return this.forgotPasswordForm.controls;
  }
}
