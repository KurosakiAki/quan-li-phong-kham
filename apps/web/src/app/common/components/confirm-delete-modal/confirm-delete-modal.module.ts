import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';


@NgModule({
    imports: [
        FontAwesomeModule,
        NgbModalModule,
        TranslateModule.forChild()
    ],
    exports: [],
    declarations: [ConfirmDeleteModalComponent],
    providers: [],
})
export class ConfirmDeleteModalModule { }
