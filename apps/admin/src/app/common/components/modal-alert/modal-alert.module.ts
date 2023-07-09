import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalAlertComponent } from './modal-alert.component';


@NgModule({
    imports: [
        FontAwesomeModule,
        NgbModalModule,
        TranslateModule.forChild()
    ],
    exports: [],
    declarations: [ModalAlertComponent],
    providers: [],
})
export class ModalAlertModule { }
