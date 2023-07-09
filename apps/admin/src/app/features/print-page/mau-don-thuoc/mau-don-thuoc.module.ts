import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MauDonThuocComponent } from './mau-don-thuoc.component';
import { Routes, RouterModule } from '@angular/router';
import { PrintLayoutModule } from '../print-layout/print-layout.module';

const routes: Routes = [
  {
    path: ':id',
    component: MauDonThuocComponent,
  },
];

@NgModule({
  exports: [
    MauDonThuocComponent
  ],
  declarations: [
    MauDonThuocComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrintLayoutModule
  ]
})
export class MauDonThuocModule { }
