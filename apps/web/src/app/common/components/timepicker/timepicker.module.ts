import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { TimePickerComponent } from './timepicker.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        NgbPopoverModule,
        TranslateModule
    ],
    exports: [TimePickerComponent],
    declarations: [TimePickerComponent],
    providers: [],
})
export class TimepickerModule { }
