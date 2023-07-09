import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'modal-alert',
    templateUrl: 'modal-alert.component.html'
})

export class ModalAlertComponent implements OnInit {
    @Input() modalParams: any = {};

    content = '';

    constructor() { }

    ngOnInit() {
        if (this.modalParams) {
            this.content = this.modalParams.content;
        }
    }
}