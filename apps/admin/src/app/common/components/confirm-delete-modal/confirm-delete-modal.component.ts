import { Component, Input, OnInit } from '@angular/core';
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface IModalParams {
  title?: string;
  content?: string;
}

@Component({
  selector: 'confirm-delete-modal',
  templateUrl: 'confirm-delete-modal.component.html',
})
export class ConfirmDeleteModalComponent implements OnInit {
  @Input() modalParams: IModalParams = {};


  faExclamationCircle = faExclamationCircle;

  constructor(private dialogRef: NgbActiveModal) {}

  ngOnInit() {

  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
