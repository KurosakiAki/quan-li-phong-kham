import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ControlErrorMessageComponent } from './control-error-message/control-error-message.component';
import { MarkFormTouchedDirective } from './make-form-touched/make-form-touched.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ControlErrorMessageComponent,
    MarkFormTouchedDirective
  ],
  declarations: [
    ControlErrorMessageComponent,
    MarkFormTouchedDirective
  ],
  providers: [],
})
export class MrhFormCommonModule { }
