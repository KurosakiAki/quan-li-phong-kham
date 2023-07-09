import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { MrhFormCommonModule } from '../../common/form/form-common.module';
import { LayoutModule } from '../../common/layout/layout.module';
import { PrivateLayoutComponent } from '../../common/layout/private-template/private-layout.component';
import { Page403Component } from './components/403/403.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyCodeComponent } from './components/register/verify-code/verify-code.component';

const routes: Routes = [
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register/:token',
        component: RegisterComponent
    },
    {
        path: 'verify-code',
        component: VerifyCodeComponent
    },
    {
        path: '403',
        component: Page403Component
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'private',
        component: PrivateLayoutComponent,
        children: [
            {
                path: 'change-password',
                component: ChangePasswordComponent
            }

        ]
    }

]

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes),
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule,
        LayoutModule,
        MrhFormCommonModule
    ],
    exports: [],
    declarations: [
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        VerifyCodeComponent,
        Page403Component,
        ResetPasswordComponent,
        ChangePasswordComponent,
        ForgotPasswordComponent
    ],
    providers: [],
})
export class AuthModule { }
