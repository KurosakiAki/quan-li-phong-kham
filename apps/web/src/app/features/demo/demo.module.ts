import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleEnum } from '@api-interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { DemoAuthComponent } from './demo-auth.component';

import { DemoComponent } from './demo.component';

const routes: Routes = [
    {
        path: '',
        component: DemoComponent
    },
    {
        path: 'auth',
        component: DemoAuthComponent,
        canActivate: [AuthGuard], data: { roles: [UserRoleEnum.ADMIN]}
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [],
    declarations: [DemoComponent, DemoAuthComponent],
    providers: [],
})
export class DemoModule { }
