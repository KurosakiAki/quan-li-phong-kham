import { Component, OnInit } from '@angular/core';
import { UserRoleEnum } from '@api-interfaces';
import { AuthService } from '../../../features/auth/auth.service';
import { menuItems } from '../../../menu-items';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'm-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements OnInit {
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
