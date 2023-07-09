import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import FormValidation from '../../../../common/form/form-validation';
import { AuthService } from '../../auth.service';
import { AuthActions, AuthSelectors, AuthState } from '../../store';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {

  faSave = faSave;
  submitted = false;
  destroy$ = new Subject();
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private store: Store<AuthState>,
    private update$: Actions
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required] ],
      confirmPassword: ['', [Validators.required] ],
    },
    {
      validators: [FormValidation.match('password', 'confirmPassword')]
    });

    this.update$.pipe(
      ofType(AuthActions.changePasswordSuccessed, AuthActions.changePasswordFailed),
      takeUntil(this.destroy$)
    )
    .subscribe((payload) => {
        if (payload.type === AuthActions.changePasswordSuccessed.type) {
          this.toastrService.success(this.translateService.instant('Đổi mật khẩu thành công'));
        } else {
          this.toastrService.error(this.translateService.instant('Lỗi khi đổi mật khẩu: ' + payload.error.error?.message));
        }
    })
  }

  ngOnInit() {}

  onSubmit() {
    if(this.changePasswordForm.valid){
      this.store.dispatch(AuthActions.changePassword({id: this.authService.currentUser.id, newPassword: this.changePasswordForm.value}));
    }
    else return;
    this.submitted = true;
  }

  get f() {
    return this.changePasswordForm.controls;
  }
}
