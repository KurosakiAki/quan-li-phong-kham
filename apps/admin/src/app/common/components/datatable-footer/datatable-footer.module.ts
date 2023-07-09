import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MDatatableFooterComponent } from './datatable-footer.component';



@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FontAwesomeModule
    ],
    exports: [MDatatableFooterComponent],
    declarations: [MDatatableFooterComponent],
    providers: [],
})
export class MDatatableFooterModule { }
