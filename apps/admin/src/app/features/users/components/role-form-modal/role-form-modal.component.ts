import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../user.service';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'ttti-role-form-modal',
  templateUrl: './role-form-modal.component.html'
})
export class RoleFormModalComponent implements OnInit {
    @Input() modalParams: any;
    roleForm: FormGroup;

    destroy$ = new Subject();

    userRoleList: any[] = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: NgbActiveModal,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        public userService: UserService,
        private dialog: NgbModal
    ) {
        this.roleForm = this.fb.group({
            userRoleCode: [null, [Validators.required] ],
        });
    }

    getUserRoleList() {
      this.userService.roleList().pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
          this.userRoleList = list.filter((data: any) => data.code !== 'ADMIN');
          if (this.modalParams) {
            this.roleForm.patchValue({userRoleCode: this.modalParams.userRoleCode})
          }
      })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    ngOnInit(): void {
        this.getUserRoleList();
    }

    onSubmit() {
      if(this.roleForm.valid){
        const ref = this.dialog.open(UserFormModalComponent, {size: 'lg'});
        ref.componentInstance.modalParams = { userRoleCode: this.roleForm.value.userRoleCode };
        this.cancel(true);
      }
    }

    cancel(changed?: boolean) {
      this.dialogRef.close(changed);
    }
}
