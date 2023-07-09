import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { faUserGroup } from '@fortawesome/pro-light-svg-icons';
import { HomeService } from './home.service';

@Component({
  selector: 'ttti-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faUserGroup = faUserGroup;

  currentUser: any;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
  ) {
    this.authService.getCurrentuser().subscribe((data: any) => {
      this.currentUser = data.userRoleCode
    })
  }

  ngOnInit() {
    this.homeService.list().subscribe((data) => {})
  }

}
