import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MauPhieuKhamBenhComponent } from './mau-phieu-kham-benh.component';
import { Routes, RouterModule } from '@angular/router';
import { PrintLayoutModule } from '../print-layout/print-layout.module';

const routes: Routes = [
  {
    path: ':id',
    component: MauPhieuKhamBenhComponent,
  },
];

@NgModule({
  exports: [
    MauPhieuKhamBenhComponent
  ],
  declarations: [
    MauPhieuKhamBenhComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrintLayoutModule
  ]
})
export class MauPhieuKhamBenhModule { }
