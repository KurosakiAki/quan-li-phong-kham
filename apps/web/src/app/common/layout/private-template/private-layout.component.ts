import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/auth.service';
import { LayoutService } from '../layout.service';
import { menuItems } from '../../../menu-items';
import { UserRoleEnum } from '@api-interfaces';

@Component({
    selector: 'm-private-layout',
    templateUrl: 'private-layout.component.html',
    styleUrls: ['./private-layout.component.scss']
})

export class PrivateLayoutComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.authService.getCurrentuser().subscribe((data: any) => {
            const userMenuItems = this.layoutService.getUserRecursiveMenu([...menuItems], data.userRoleCode);
            this.layoutService.setState('menuItems', userMenuItems);
            this.layoutService.setUserState('userRoleCode', data.userRoleCode);
        }, (error) => {
            const userMenuItems = this.layoutService.getUserRecursiveMenu([...menuItems], UserRoleEnum.GUEST);
            this.layoutService.setState('menuItems', userMenuItems);
            this.layoutService.setUserState('userRoleCode', "GUEST");
        })
    }
}
