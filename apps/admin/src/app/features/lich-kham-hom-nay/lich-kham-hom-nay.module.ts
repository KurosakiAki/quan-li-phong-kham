import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LichKhamHomNayComponent } from './lich-kham-hom-nay.component';
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
import { LapDonThuocFormModalComponent } from './lap-don-thuoc-form-modal/lap-don-thuoc-form-modal.component';
import { KetLuanFormModalComponent } from './ket-luan-form-modal/ket-luan-form-modal.component';
import { LapPhieuDichVuComponent } from './lap-phieu-dich-vu/lap-phieu-dich-vu.component';

const routes: Routes = [
  {
    path: '',
    component: LichKhamHomNayComponent,
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
    LichKhamHomNayComponent,
    LapDonThuocFormModalComponent,
    KetLuanFormModalComponent,
    LapPhieuDichVuComponent
  ],
  providers: [],
})
export class LichKhamHomNayModule { }
