import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { faLock, faPencil, faPlus, faSearch, faTrashAlt, faWalking } from '@fortawesome/pro-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ScreenSize } from '../../../../common/services/screen-size.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserChangePasswordModalComponent } from '../user-change-password-modal/user-change-password-modal.component';
import { ConfirmDeleteModalComponent } from '../../../../common/components/confirm-delete-modal/confirm-delete-modal.component';
import { UserService } from '../../user.service';
import { RoleFormModalComponent } from '../role-form-modal/role-form-modal.component';

@Component({
    selector: 'app-users',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UserComponent implements OnInit {
    @ViewChild(DatatableComponent) myFilterTable!: DatatableComponent;

    faSearch = faSearch;
    faPlus = faPlus;
    faPencil = faPencil;
    faLock = faLock;
    faTrashAlt = faTrashAlt;
    faWalking = faWalking;

    searchStr : any;

    userList: any[] = [];
    temp: any;

    params = {
        limit: 20,
        page: 1
    };

    lastPage = 0;
    tableOffset = 0;

    destroy$ = new Subject();

    constructor(
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private dialog: NgbModal,
        private cdr: ChangeDetectorRef,
        public screenSize: ScreenSize,
        public userService: UserService
    ) {

    }

    ngOnInit() {
        this.loadUserList();
        this.setParamsListItem();
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter((d: any) => {
            return d.fullname.toLowerCase().indexOf(val) !== -1 || 
            d.username.toLowerCase().indexOf(val) !== -1 ||
            d.phone.toLowerCase().indexOf(val) !== -1 ||
            !val;
        });
        // update the rows
        this.userList = temp;
        if (this.myFilterTable) {
            // Whenever the filter changes, always go back to the first page
            this.myFilterTable.offset = 0;
        }
        this.setParamsListItem();
    }

    loadUserList = () => {
        this.userService.list().pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
            this.userList = data.filter((data: any) => data.userRoleCode !== 'ADMIN');
            this.temp = data;
            this.searchStr = null;
            this.setParamsListItem();
        });
    };

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    footerChangeEvent(event: any) {
        if (this.params.limit != event.limit) {
            this.params.limit = event.limit;
            this.tableOffset = 0;
        } else {
            this.tableOffset = event.page-1;
        }
    }


    openChangePasswordModal(user: any) {
        const ref = this.dialog.open(UserChangePasswordModalComponent);
        ref.componentInstance.modalParams = { id: user.id };
    }

    openFormModal() {
        const ref = this.dialog.open(RoleFormModalComponent);
        this.userService.modalSubmitted$.pipe(takeUntil(this.destroy$)).subscribe(dataChanged => {
            if (dataChanged) {
                this.loadUserList();
            }
        }, () => { })
    }

    openComfirmModal(item: any) {
        const ref = this.dialog.open(ConfirmDeleteModalComponent);
        ref.componentInstance.modalParams = { title: 'Xóa nhân viên', content: 'Bạn có đồng ý xóa nhân viên này?' };
        ref.result.then(isDelete => {
        if (isDelete) {
            this.userService.removeUserInfo(item.roleId, this.userService.convertRole(item.userRoleCode))
            .subscribe(res => {
                this.userService.remove(item.id).subscribe(res => {
                    this.toastrService.success(this.translateService.instant('Xóa thành công'))
                    this.loadUserList();
                }, (err: any) => {
                    this.toastrService.error(err.error?.message);
                });
            }, (err: any) => {
                this.toastrService.error(err.error?.message);
            })
        }
        }, () => { })
    }

    setParamsListItem() {
        if (this.userList.length % this.params.limit > 0 ) {
            this.lastPage = Math.floor(this.userList.length/this.params.limit) + 1;
        } else {
            this.lastPage = Math.floor(this.userList.length/this.params.limit);
        }
        this.tableOffset = 0;
    }
}
