import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDeleteModalModule } from '../../common/components/confirm-delete-modal/confirm-delete-modal.module';
import { MDatatableFooterModule } from '../../common/components/datatable-footer/datatable-footer.module';
import { SystemLogModule } from '../../common/components/system-log/system-log.module';
import { LayoutModule } from '../../common/layout/layout.module';
import { UserChangePasswordModalComponent } from './components/user-change-password-modal/user-change-password-modal.component';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { UserFormComponent } from './components/user-form/user-form.component';

import { MrhFormCommonModule } from '../../common/form/form-common.module';
import { UserComponent } from './components/users-list/users-list.component';
import { RoleFormModalComponent } from './components/role-form-modal/role-form-modal.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent
    },
    {
        path: ':id',
        component: UserFormComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxDatatableModule,
        TranslateModule.forChild(),
        FontAwesomeModule,
        ToastrModule,
        NgbModalModule,
        NgbTooltipModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        NgSelectModule,
        ConfirmDeleteModalModule,
        MDatatableFooterModule,
        SystemLogModule,
        MrhFormCommonModule
    ],
    exports: [],
    declarations:
        [
            UserComponent,
            UserFormModalComponent,
            RoleFormModalComponent,
            UserChangePasswordModalComponent,
            UserFormComponent
        ],
    providers: [],
})
export class UsersModule { }
