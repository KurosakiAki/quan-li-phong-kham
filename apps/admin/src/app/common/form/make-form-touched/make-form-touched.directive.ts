import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';

/* @description
 * 	Show error fields of form when hovering
 * @usage
 *     <button [btnForm]="sampleForm">Submit</button>
 */

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'make-form-touched, [make-form-touched]' })
export class MarkFormTouchedDirective {

  constructor(private el: ElementRef) {

  }

  @Input() form!: FormGroup;
  @Input() formId!: string;

  @HostListener('mouseover') onMouseEnter() {
    this.checkForm();
  }

  @HostListener('click') onClick() {
    this.checkForm();
  }

  checkForm() {
    this.markFormGroupTouched(this.form);
    if (this.form.invalid) {
      if (this.formId) {
        // Focus to first invalid element
        const formElm = document.getElementById(this.formId);
        if (formElm) {
          const formGroupInvalid = formElm.querySelectorAll('.ng-invalid');
          if (formGroupInvalid.length) {
            const firstControl = formGroupInvalid[0] as HTMLElement;
            const input = firstControl.querySelector('input, textinput, select') as HTMLElement;
            if (input) {
              setTimeout(() => {
                input.focus();
                input.click();
              }, 200);

            }
          }
        }
      }

    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
