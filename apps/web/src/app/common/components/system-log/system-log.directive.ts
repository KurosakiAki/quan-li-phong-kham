import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[system-log-content]' })
export class SystemLogContentDirective {
  constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[system-log-new-content]' })
export class SystemLogNewContentDirective {
  constructor(public template: TemplateRef<any>) { }
}
