import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PrintLayoutModule } from '../print-layout/print-layout.module';
import { MauNhapKhoComponent } from './mau-nhap-kho.component';

const routes: Routes = [
  {
    path: ':id',
    component: MauNhapKhoComponent,
  },
];

@NgModule({
  exports: [
    MauNhapKhoComponent
  ],
  declarations: [
    MauNhapKhoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrintLayoutModule
  ]
})
export class MauNhapKhoModule { }
