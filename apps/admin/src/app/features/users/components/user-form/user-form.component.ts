import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemLogObjectTypeEnum, UserRoleEnum } from '@api-interfaces';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from '../../user.service';


@Component({
    selector: 'user-form',
    templateUrl: 'user-form.component.html',
})

export class UserFormComponent implements OnInit {
    faSave = faSave;
    userRoleList: any[] = [];
    chuyenKhoaList: any[] = [];

    userForm: FormGroup;
    userId!: number;
    systemLogType = SystemLogObjectTypeEnum.USER;

    destroy$ = new Subject();

    genderSelect = [
      'Nam',
      'Nữ'
    ];

    specialistIdCopy: any = null;
    user: any = {};

    constructor(
        private fb: FormBuilder,
        private toastrService: ToastrService,
        public userService: UserService,
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private translateService: TranslateService
    ) {
        this.userForm = this.fb.group({
            referenceId: [null],
            username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
            fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)] ],
            email: ['', [ Validators.required, Validators.email, Validators.maxLength(255)] ],
            birthday: [null, [Validators.required]],
            gender: [null, [Validators.required]],
            phone: ['', [Validators.required, Validators.maxLength(20)] ],
            address: [null, [Validators.minLength(2), Validators.maxLength(255)]],
            specialistId: [null],
            userRoleCode: [null, [Validators.required] ],
        });

        this.userForm.get('userRoleCode')?.valueChanges.subscribe(role => {
          if(role == UserRoleEnum.DOCTOR){
            this.userForm.get('specialistId')?.setValidators([Validators.required]);
            this.userForm.get('specialistId')?.enable();
            this.userForm.get('specialistId')?.patchValue(this.specialistIdCopy);
          }
          else {
            this.userForm.get('specialistId')?.clearValidators();
            if (this.specialistIdCopy == null){
              this.specialistIdCopy = this.userForm.value.specialistId;
            }
            this.userForm.get('specialistId')?.patchValue(null);
            this.userForm.get('specialistId')?.disable();
          }
          this.userForm.get('specialistId')?.updateValueAndValidity();
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getUserRoleList() {
      this.userService.roleList().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
          this.userRoleList = list.filter((data: any) => data.code !== 'ADMIN');
      })
    }

    getChuyenKhoaList() {
      this.userService.chuyenKhoaList().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
          this.chuyenKhoaList = list;
      })
    }

    ngOnInit() {
      this.getChuyenKhoaList();
      this.getUserRoleList();

      this.userId = this.activatedRoute.snapshot.params['id'];
      this.userService.get(this.userId).pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.user = data;
        this.userForm.patchValue(data);
      })
    }

    validatePhone() {
        if (!this.userForm.value.phone) {
            return false;
        } else {
            return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.userForm.value.phone));
        }
    }

    onSubmit() {
      if(this.userForm.valid){
        const postData = {
          ...this.userForm.value,
          userId: this.userId,
          tienSuBenh: "Chưa có thông tin",
        };
        const update$ = this.userService.update(this.userId, this.userForm.value);
        const updatedUserInfo$ = this.userService.updateUserInfo(this.user.roleId, this.userService.convertRole(this.userForm.value.userRoleCode), this.userForm.value);
        const createUserInfo$ = this.userService.createUserInfo(this.userService.convertRole(this.userForm.value.userRoleCode), postData);
        const removeUserInfo$ = this.userService.removeUserInfo(this.user.roleId, this.userService.convertRole(this.user.userRoleCode));

        if(this.user.userRoleCode != this.userForm.value.userRoleCode){
          forkJoin([update$, createUserInfo$, removeUserInfo$]).subscribe(res => {
            this.toastrService.success(this.translateService.instant('Cập nhật thành công'));
          }, (err: any) => {
            this.toastrService.error(this.translateService.instant('Lỗi khi cập nhật tài khoản:' + err.error?.message));
          });
        }
        else forkJoin([update$, updatedUserInfo$]).subscribe(res => {
          this.toastrService.success(this.translateService.instant('Cập nhật thành công'));
        }, (err: any) => {
          this.toastrService.error(this.translateService.instant('Lỗi khi cập nhật tài khoản:' + err.error?.message));
        });
      }
    }

    goBack(): void {
        this.route.navigate(['/app/users']);
    }
}
