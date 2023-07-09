import { Component, OnInit } from '@angular/core';
import { faLock, faSignOut, faSpinner, faUser } from '@fortawesome/pro-regular-svg-icons';
import { AuthService } from 'apps/admin/src/app/features/auth/auth.service';

@Component({
    selector: 'm-user-profile',
    templateUrl: 'user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})

export class UserProfileHeaderComponent implements OnInit {
    faSpinner = faSpinner;
    faUser = faUser;
    faLock = faLock;
    faSignOut = faSignOut;

    constructor(
        public authService: AuthService,
    ) { }

    ngOnInit() {

    }
}