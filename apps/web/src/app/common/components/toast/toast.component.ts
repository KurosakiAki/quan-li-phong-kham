import { Component, OnInit } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
    selector: '[m-toast]',
    styleUrls: ['./toast.component.scss'],
    templateUrl: './toast.component.html'
})

export class ToastComponent extends Toast implements OnInit {

    ngOnInit(): void {
        this.toastClasses = `m-${this.toastPackage.toastType}`;
    }
}