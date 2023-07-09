import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSave } from '@fortawesome/pro-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import FormValidation from '../../../../common/form/form-validation';
import { AuthService } from '../../auth.service';
import { AuthActions, AuthState } from '../../store';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  token: string;
  faSave = faSave;
  submitted = false;
  resetPasswordForm: FormGroup;

  destroy$ = new Subject();
  
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AuthState>,
    private update$: Actions
  ) {
    this.token = this.actRoute.snapshot.params['token'];

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required] ],
      confirmPassword: ['', [Validators.required] ],
    },
    {
      validators: [FormValidation.match('password', 'confirmPassword')]
    });

    this.update$.pipe(
      ofType(AuthActions.resetPasswordSuccessed, AuthActions.resetPasswordFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.resetPasswordSuccessed.type) {
          this.toastrService.success(this.translateService.instant('Thay đổi mật khẩu thành công'));
          this.router.navigate(['/auth', 'login']);
        } else {
          if (payload.error.error?.message === 'Token does not exist') {
            this.toastrService.error(this.translateService.instant('Sai đường dẫn cài lại mật khẩu'));
          } else {
            this.toastrService.error(this.translateService.instant(payload.error.error?.message));
          }
        }
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    if(this.resetPasswordForm.valid){
      this.store.dispatch(AuthActions.resetPassword({data: { password: this.resetPasswordForm.value.password, token: this.token }}));
    }
    else return;
    this.submitted = true;
  }

  get f() {
    return this.resetPasswordForm.controls;
  }
}
