import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthActions, AuthState } from '../../store';


@Component({
    template: ''
})

export class LogoutComponent implements OnInit {

    constructor(
        private router: Router,
        private store: Store<AuthState>,
        private update$: Actions
    ) { }

    ngOnInit() {
        this.store.dispatch(AuthActions.logout());
        this.router.navigate(['/app/trang-chu']);
    }
}