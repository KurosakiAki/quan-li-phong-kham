import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';
import { UserRoleEnum } from '@api-interfaces';
import { RoleFormModalComponent } from '../role-form-modal/role-form-modal.component';


@Component({
    selector: 'user-form-modal',
    templateUrl: 'user-form-modal.component.html',
})

export class UserFormModalComponent implements OnInit {
    @Input() modalParams: any;
    userForm: FormGroup;

    selectedOption: any;

    destroy$ = new Subject();

    faSave = faSave;

    partiesList: any[] = [];
    chuyenKhoaList: any[] = [];
    specialistIdCopy: any = null;

    genderSelect = [
        'Nam',
        'Nữ'
    ];

    user: any;

    constructor(
        private fb: FormBuilder,
        private dialogRef: NgbActiveModal,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        public userService: UserService,
        private dialog: NgbModal
    ) {
        this.userForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
            fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)] ],
            birthday: [null, [Validators.required]],
            gender: [null, [Validators.required]],
            phone: ['', [Validators.required, Validators.maxLength(20)] ],
            address: ['', [Validators.minLength(2), Validators.maxLength(255)]],
            specialistId: [null],
            userRoleCode: [null, [Validators.required] ],
            password: ['', [Validators.required, Validators.minLength(6)] ],
            rePassword: ['', [Validators.required, Validators.minLength(6)] ]
        });
    }

    getChuyenKhoaList() {
      this.userService.chuyenKhoaList().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
          this.chuyenKhoaList = list;
      })
    }

    getPartiesList() {
      this.userService.listParties(this.userService.convertRole(this.modalParams.userRoleCode))
      .pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
          this.partiesList = list;
      })
    }

    validateUserRoleCode(){
        if (this.modalParams) {
            this.userForm.patchValue({userRoleCode: this.modalParams.userRoleCode});
            if(this.modalParams.userRoleCode == UserRoleEnum.DOCTOR){
                this.userForm.get('specialistId')?.setValidators([Validators.required]);
            }
            else {
                this.userForm.get('specialistId')?.clearValidators();
                this.userForm.get('specialistId')?.disable();
            }
            this.userForm.get('specialistId')?.updateValueAndValidity();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    ngOnInit(): void {
        this.getChuyenKhoaList();
        this.getPartiesList();
        
        this.validateUserRoleCode();
        
        // const defaultBirthday = new Date();
        // defaultBirthday.setFullYear(defaultBirthday.getFullYear() - 10);
        // this.userForm.patchValue({birthday: defaultBirthday});
    }

    validatePhone() {
        if (!this.userForm.value.phone) {
            return false;
        } else {
            return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.userForm.value.phone));
        }
    }

    onSelectChange(event: any) {
        if (event === null) {
            this.userForm.enable();
            this.validateUserRoleCode()
            this.userForm.patchValue({
              fullname: '',
              email: '',
              phone: '',
              birthday: null,
              gender: null,
              address: '',
              specialistId: null
            });
        } else {
            this.userForm.patchValue(event);
            const usernameControl = this.userForm.get('username');
            const passwordControl = this.userForm.get('password');
            const rePasswordControl = this.userForm.get('rePassword');
            this.userForm.disable();
            usernameControl?.enable();
            passwordControl?.enable();
            rePasswordControl?.enable();
        }
    }

    onSubmit() {
        this.userForm.markAllAsTouched();
        
        const party = this.partiesList.find(party => party.fullname === this.userForm.getRawValue().fullname
         && party.phone === this.userForm.getRawValue().phone && party.email === this.userForm.getRawValue().email);
        
        if(this.userForm.valid && (this.userForm.getRawValue().password === this.userForm.getRawValue().rePassword) 
        && !this.validatePhone() && !this.selectedOption?.userId
        && !party?.userId){
            this.userService.create(this.userForm.getRawValue()).subscribe(res => {
                this.user = {
                    ...this.userForm.getRawValue(),
                    userId: res.id
                }
                if(!this.selectedOption && !party){
                    this.userService.createUserInfo(this.userService.convertRole(this.userForm.getRawValue().userRoleCode), {
                        ...this.user,
                        tienSuBenh: "Chưa có thông tin",
                    })
                    .subscribe(res => {
                        this.toastrService.success(this.translateService.instant('Thêm tài khoản thành công'));
                        this.userService.modalSubmitted$.next(true);
                        this.cancel(true);
                    }, (err: any) => {
                        this.toastrService.error(this.translateService.instant('Lỗi khi thêm tài khoản:' + err.error?.message));
                    })
                }
                else this.userService.updateUserInfo(party?.id, this.userService.convertRole(this.userForm.getRawValue().userRoleCode), this.user)
                .subscribe(res => {
                    this.toastrService.success(this.translateService.instant('Thêm tài khoản thành công'));
                    this.userService.modalSubmitted$.next(true);
                    this.cancel(true);
                }, (err: any) => {
                    this.toastrService.error(this.translateService.instant('Lỗi khi thêm tài khoản:' + err.error?.message));
                })
            }, (err: any) => {
                this.toastrService.error(this.translateService.instant('Lỗi khi thêm tài khoản:' + err.error?.message));
            })
        }
        else if (this.selectedOption?.userId || party?.userId){
            this.toastrService.error(this.translateService.instant('Người này đã có tài khoản'));
        }
    }

    goBack(): void {
        const ref = this.dialog.open(RoleFormModalComponent);
        ref.componentInstance.modalParams = { userRoleCode: this.modalParams.userRoleCode};
        this.cancel(true);
    }

    cancel(changed?: boolean) {
        this.dialogRef.close(changed);
    }
}
