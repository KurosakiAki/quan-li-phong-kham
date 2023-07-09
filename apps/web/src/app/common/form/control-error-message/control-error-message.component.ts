import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'control-error-message',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({height: '0px', opacity: 0}),
        animate('500ms', style({height: '18px', opacity: 1}))
      ]),
      transition(':leave', [
        style({height: '18px', opacity: 1}),
        animate('500ms', style({height: '0px', opacity: 0}))
      ])
    ])
  ],
  styles: [`
    .control-invalid {
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875em;
      color: #ff3d00;
    }
  `],
  templateUrl: 'control-error-message.component.html'
})
export class ControlErrorMessageComponent implements OnInit {
  @Input() control!: FormControl | AbstractControl;
  @Input() customError: any;

  constructor() { }

  ngOnInit() { }


}
