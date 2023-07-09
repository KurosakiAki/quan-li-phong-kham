import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MauHoaDonComponent } from './mau-hoa-don.component';
import { RouterModule, Routes } from '@angular/router';
import { PrintLayoutModule } from '../print-layout/print-layout.module';

const routes: Routes = [
  {
    path: ':id',
    component: MauHoaDonComponent,
  },
];

@NgModule({
  exports: [
    MauHoaDonComponent
  ],
  declarations: [
    MauHoaDonComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrintLayoutModule
  ]
})
export class MauHoaDonModule { }
