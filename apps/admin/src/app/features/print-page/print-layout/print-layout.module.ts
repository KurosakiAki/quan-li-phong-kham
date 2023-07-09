import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintLayoutComponent } from './print-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PrintLayoutComponent
  ],
  declarations: [
    PrintLayoutComponent
  ],
  providers: [],
})
export class PrintLayoutModule { }
