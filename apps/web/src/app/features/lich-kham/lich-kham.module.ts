import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LichKhamComponent } from './lich-kham.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDeleteModalModule } from '../../common/components/confirm-delete-modal/confirm-delete-modal.module';
import { MDatatableFooterModule } from '../../common/components/datatable-footer/datatable-footer.module';
import { SystemLogModule } from '../../common/components/system-log/system-log.module';
import { TimepickerModule } from '../../common/components/timepicker/timepicker.module';
import { MrhFormCommonModule } from '../../common/form/form-common.module';
import { LayoutModule } from '../../common/layout/layout.module';

const routes: Routes = [
  {
    path: '',
    component: LichKhamComponent,
  },
];

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
    MrhFormCommonModule,
    TimepickerModule
  ],
  exports: [],
  declarations: [
    LichKhamComponent
  ],
  providers: [],
})
export class LichKhamModule { }
