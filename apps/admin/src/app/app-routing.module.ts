import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleEnum } from '@api-interfaces';
import { LayoutModule } from './common/layout/layout.module';
import { PrivateLayoutComponent } from './common/layout/private-template/private-layout.component';
import { AuthGuard } from './features/auth/auth.guard';
import { PrintLayoutModule } from './features/print-page/print-layout/print-layout.module';
import { PrintLayoutComponent } from './features/print-page/print-layout/print-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/app/lich-kham', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.module').then((m) => m.UsersModule),
        canActivate: [AuthGuard],
        data: { roles: [UserRoleEnum.ADMIN] },
      },
      {
        path: 'lich-kham',
        loadChildren: () =>
          import('./features/lich-kham/lich-kham.module').then((m) => m.LichKhamModule),
      },
      {
        path: 'lich-kham-hom-nay',
        loadChildren: () =>
          import('./features/lich-kham-hom-nay/lich-kham-hom-nay.module').then((m) => m.LichKhamHomNayModule),
        canActivate: [AuthGuard],
        data: { roles: [UserRoleEnum.DOCTOR] },
      },
      {
        path: 'chuyen-khoa',
        loadChildren: () =>
          import('./features/chuyen-khoa/chuyen-khoa.module').then((m) => m.ChuyenKhoaModule),
      },
      {
        path: 'danh-sach-thuoc',
        loadChildren: () =>
          import('./features/thuoc/thuoc.module').then((m) => m.ThuocModule),
      },
      {
        path: 'don-thuoc',
        loadChildren: () =>
          import('./features/don-thuoc/don-thuoc.module').then((m) => m.DonThuocModule),
      },
      {
        path: 'phieu-kham-benh',
        loadChildren: () =>
          import('./features/phieu-kham-benh/phieu-kham-benh.module').then((m) => m.PhieuKhamBenhModule),
      },
      {
        path: 'hoa-don',
        loadChildren: () =>
          import('./features/hoa-don/hoa-don.module').then((m) => m.HoaDonModule),
      },
      {
        path: 'phieu-dich-vu',
        loadChildren: () =>
          import('./features/phieu-dich-vu/phieu-dich-vu.module').then((m) => m.PhieuDichVuModule),
      },
      {
        path: 'nha-cung-cap',
        loadChildren: () =>
          import('./features/nha-cung-cap/nha-cung-cap.module').then((m) => m.NhaCungCapModule),
      },
      {
        path: 'nhap-kho',
        loadChildren: () =>
          import('./features/nhap-kho-thuoc/nhap-kho-thuoc.module').then((m) => m.NhapKhoThuocModule),
          canActivate: [AuthGuard],
          data: { roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF] },
      },
      {
        path: 'tinh-trang',
        loadChildren: () =>
          import('./features/tinh-trang-lo-thuoc/tinh-trang-lo-thuoc.module').then((m) => m.TinhTrangLoThuocModule),
          canActivate: [AuthGuard],
          data: { roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF] },
      },
      {
        path: 'benh-nhan',
        loadChildren: () =>
          import('./features/benh-nhan/benh-nhan.module').then((m) => m.BenhNhanModule),
      },
      {
        path: 'bac-si',
        loadChildren: () =>
          import('./features/bac-si/bac-si.module').then((m) => m.BacSiModule),
      },
      {
        path: 'nhan-vien',
        loadChildren: () =>
          import('./features/nhan-vien/nhan-vien.module').then((m) => m.NhanVienModule),
      },
      {
        path: 'dich-vu',
        loadChildren: () =>
          import('./features/dich-vu/dich-vu.module').then((m) => m.DichVuModule),
      },
    ],
  },
  { 
    path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      { 
        path: 'mau-hoa-don',
        loadChildren: () =>
          import('./features/print-page/mau-hoa-don/mau-hoa-don.module').then((m) => m.MauHoaDonModule),
      },
      { 
        path: 'mau-phieu-dich-vu',
        loadChildren: () =>
          import('./features/print-page/mau-phieu-dich-vu/mau-phieu-dich-vu.module').then((m) => m.MauPhieuDichVuModule),
      },
      { 
        path: 'mau-don-thuoc',
        loadChildren: () =>
          import('./features/print-page/mau-don-thuoc/mau-don-thuoc.module').then((m) => m.MauDonThuocModule),
      },
      { 
        path: 'mau-phieu-kham-benh',
        loadChildren: () =>
          import('./features/print-page/mau-phieu-kham-benh/mau-phieu-kham-benh.module').then((m) => m.MauPhieuKhamBenhModule),
      },
      { 
        path: 'mau-nhap-kho',
        loadChildren: () =>
          import('./features/print-page/mau-nhap-kho/mau-nhap-kho.module').then((m) => m.MauNhapKhoModule),
      }
    ]
  }
];

@NgModule({
  imports: [LayoutModule, PrintLayoutModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
