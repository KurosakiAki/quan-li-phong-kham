import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSave } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'ttti-profile-form-modal',
  templateUrl: './profile-form-modal.component.html',
  styleUrls: ['./profile-form-modal.component.scss'],
})
export class ProfileFormModalComponent implements OnInit {
  @Input() modalParams: any;

  faSave = faSave;
  userRoleList: any[] = [];
  chuyenKhoaList: any[] = [];

  userForm: FormGroup;
  profile: any;

  destroy$ = new Subject();

  genderSelect = [
    'Nam',
    'Nữ'
  ];

  constructor(
      private fb: FormBuilder,
      private toastrService: ToastrService,
      public profileService: ProfileService,
      private dialogRef: NgbActiveModal,
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
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
  }

  ngOnInit() {
    if (this.modalParams.profile) {
      this.profile = { ...this.modalParams.profile };
      this.userForm.patchValue(this.profile)
    }
  }

  validatePhone() {
      if (!this.userForm.value.phone) {
          return false;
      } else {
          return !(/((09|03|07|08|05)+([0-9]{8})\b)/g.test(this.userForm.value.phone));
      }
  }

  onSubmit() {
    this.userForm.markAllAsTouched()
    if(this.userForm.valid){

      const update$ = this.profileService.updateProfile(this.userForm.value);
      const updatedUserInfo$ = this.profileService.updateUserInfo(this.profile.id,this.profile.role ,
        {
          ...this.userForm.value,
          userId: this.profile.userId
        });

      forkJoin([update$, updatedUserInfo$]).subscribe((res: any) => {
        this.toastrService.success(this.translateService.instant('Cập nhật thành công'));
        this.cancel(true);
      }, (err: any) => {
        this.toastrService.error(this.translateService.instant('Lỗi khi cập nhật thông tin:' + err.error?.message));
      });
    }
  }

  cancel(changed?: boolean) {
    this.dialogRef.close(changed);
  }
}
