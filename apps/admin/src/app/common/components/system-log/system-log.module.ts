import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SystemLogComponent } from './system-log.component';
import { SystemLogContentDirective, SystemLogNewContentDirective } from './system-log.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [SystemLogComponent, SystemLogContentDirective, SystemLogNewContentDirective],
    declarations: [SystemLogComponent, SystemLogContentDirective, SystemLogNewContentDirective],
    providers: [],
})
export class SystemLogModule { }
