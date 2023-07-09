import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
  imports: [
    NgbModalModule
  ],
  exports: [ConfirmModalComponent],
  declarations: [ConfirmModalComponent],
  providers: [],
})
export class ConfirmModalModule { }
