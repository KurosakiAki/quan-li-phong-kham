import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-modal',
  templateUrl: 'confirm-modal.component.html'
})

export class ConfirmModalComponent implements OnInit {
  @Input() title!: string;
  @Input() content!: string;

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit() { }
}
