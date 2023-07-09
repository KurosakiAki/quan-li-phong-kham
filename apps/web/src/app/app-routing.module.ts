import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleEnum } from '@api-interfaces';
import { LayoutModule } from './common/layout/layout.module';
import { PrivateLayoutComponent } from './common/layout/private-template/private-layout.component';
import { AuthGuard } from './features/auth/auth.guard';
import { SiteLayoutComponent } from './common/layout/site-template/site-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/app/trang-chu', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    component: SiteLayoutComponent,
    children: [
      {
        path: 'trang-chu',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'dang-ky-kham',
        loadChildren: () =>
          import('./features/dang-ky-kham/dang-ky-kham.module').then((m) => m.DangKyKhamModule),
      }
    ],
  },
  {
    path: 'app',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'lich-kham',
        loadChildren: () =>
          import('./features/lich-kham/lich-kham.module').then((m) => m.LichKhamModule),
          canActivate: [AuthGuard],
          data: { roles: [UserRoleEnum.PATIENT] },
      },
      {
        path: 'ho-so',
        loadChildren: () =>
          import('./features/ho-so/ho-so.module').then((m) => m.HoSoModule),
          canActivate: [AuthGuard],
          data: { roles: [UserRoleEnum.PATIENT] },
      },
      {
        path: 'hoa-don',
        loadChildren: () =>
          import('./features/hoa-don/hoa-don.module').then((m) => m.HoaDonModule),
          canActivate: [AuthGuard],
          data: { roles: [UserRoleEnum.PATIENT] },
      }
    ],
  },
];

@NgModule({
  imports: [LayoutModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
