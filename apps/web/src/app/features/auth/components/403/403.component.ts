import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-403',
    templateUrl: '403.component.html'
})

export class Page403Component implements OnInit {
    constructor(private router: Router,) { }

    ngOnInit() { }

    goBack() {
      window.location.href = '/';
    }
}
