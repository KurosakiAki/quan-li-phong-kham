import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header/header.component';
import { UserProfileHeaderComponent } from './header/user-profile/user-profile.component';
import { PageContainerComponent } from './page/page-container/page-container.component';
import { PageHeaderComponent } from './page/page-header/page-header.component';
import { PageTitleComponent } from './page/page-title/page-title.component';
import { PrivateLayoutComponent } from './private-template/private-layout.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        TranslateModule,
        NgbDropdownModule,
        NgbPopoverModule,
        FontAwesomeModule
    ],
    exports: [
        HeaderComponent,
        UserProfileHeaderComponent,
        PrivateLayoutComponent,
        PageTitleComponent,
        PageHeaderComponent,
        PageContainerComponent,
        FontAwesomeModule
    ],
    declarations: [
        HeaderComponent,
        UserProfileHeaderComponent,
        PrivateLayoutComponent,
        PageTitleComponent,
        PageHeaderComponent,
        PageContainerComponent
    ],
    providers: [],
})
export class LayoutModule { }
