import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../user.service';


@Component({
    selector: 'user-change-password-modal',
    templateUrl: 'user-change-password-modal.component.html'
})

export class UserChangePasswordModalComponent implements OnInit {
    @Input() modalParams: any;

    userForm: FormGroup;

    faSave = faSave;

    password: any = null;
    confirmPassword: any = null;
    userId: any = null;

    constructor(
        private fb: FormBuilder,
        private dialogRef: NgbActiveModal,
        private toastrService: ToastrService,
        public userService: UserService,
        private translateService: TranslateService
    ) { 
        this.userForm = this.fb.group({
            password: ['', [Validators.required] ],
            confirmPassword: ['', [Validators.required] ],
        });
    }

    ngOnInit() {
        if (this.modalParams) {
            this.userId = this.modalParams.id
        }
    }

    onSubmit() {
        this.userForm.markAllAsTouched();
        if(this.userForm.valid && (this.userForm.value.password === this.userForm.value.confirmPassword)){
            this.userService.changePassword(this.userId, this.userForm.value).subscribe((res: any) => {
                this.toastrService.success(this.translateService.instant('Thay đổi mật khẩu thành công'));
            }, (err: any) => {
                this.toastrService.error(this.translateService.instant('Lỗi khi đổi mật khẩu: ' + err.error?.message));
            })
            this.cancel(true);
        }
        else return;
    }

    cancel(changed?: boolean) {
        this.dialogRef.close(changed);
    }
}