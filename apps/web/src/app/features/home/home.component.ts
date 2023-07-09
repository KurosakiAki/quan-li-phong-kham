import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ttti-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: any;

  constructor(
    private authService: AuthService
  ) {
    this.authService.getCurrentuser().subscribe((data: any) => {
      this.currentUser = data.userRoleCode
    })
  }

  ngOnInit() {
  }

}
