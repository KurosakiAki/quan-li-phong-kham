import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DatLichKhamComponent } from './dat-lich-kham/dat-lich-kham.component';
import { LayoutModule } from '../../common/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbTooltipModule, NgbDatepickerModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDeleteModalModule } from '../../common/components/confirm-delete-modal/confirm-delete-modal.module';
import { MDatatableFooterModule } from '../../common/components/datatable-footer/datatable-footer.module';
import { SystemLogModule } from '../../common/components/system-log/system-log.module';
import { MrhFormCommonModule } from '../../common/form/form-common.module';
import { TimepickerModule } from '../../common/components/timepicker/timepicker.module';
import { ChonBacSiComponent } from './chon-bac-si/chon-bac-si.component';

const routes: Routes = [
  {
    path: '',
    component: ChonBacSiComponent,
  },
  {
      path: ':id',
      component: DatLichKhamComponent
  }
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
    NgbAccordionModule,
    ConfirmDeleteModalModule,
    MDatatableFooterModule,
    SystemLogModule,
    MrhFormCommonModule,
    TimepickerModule
  ],
  exports: [],
  declarations: [
    DatLichKhamComponent,
    ChonBacSiComponent
  ],
  providers: [],
})
export class DangKyKhamModule { }
