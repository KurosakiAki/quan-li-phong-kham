import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MauPhieuDichVuComponent } from './mau-phieu-dich-vu.component';
import { Routes, RouterModule } from '@angular/router';
import { PrintLayoutModule } from '../print-layout/print-layout.module';

const routes: Routes = [
  {
    path: ':id',
    component: MauPhieuDichVuComponent,
  },
];

@NgModule({
  exports: [
    MauPhieuDichVuComponent
  ],
  declarations: [
    MauPhieuDichVuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrintLayoutModule
  ]
})
export class MauPhieuDichVuModule { }
