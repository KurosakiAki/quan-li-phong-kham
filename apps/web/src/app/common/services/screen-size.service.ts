import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Detect screen size break-point base on bootstrap 4 css breakpoint
 */
@Injectable({providedIn: 'root'})
export class ScreenSize {
  is = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  };

  get smallerThan() {
      return {
        sm: this.is.xs,
        md: this.is.xs || this.is.sm,
        lg: this.is.xs || this.is.sm || this.is.md,
        xl: this.is.xs || this.is.sm || this.is.md || this.is.lg, 
      }
  }

  private changeScreenSizeSub = new Subject<void>();
  changeScreenSize$ = this.changeScreenSizeSub.asObservable();

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe('(max-width: 575.99px)')
    .subscribe(result => {
        this.is.xs = result.matches;
        this.changeScreenSizeSub.next();
    });

    breakpointObserver.observe('(min-width: 576px) and (max-width: 767.99px)')
    .subscribe(result => {
        this.is.sm = result.matches;
        this.changeScreenSizeSub.next();
    });

    breakpointObserver.observe('(min-width: 768px) and (max-width: 991.99px)')
    .subscribe(result => {
        this.is.md = result.matches;
        this.changeScreenSizeSub.next();
    });

    breakpointObserver.observe('(min-width: 992px) and (max-width: 1199.99px)')
    .subscribe(result => {
        this.is.lg = result.matches;
        this.changeScreenSizeSub.next();
    });

    breakpointObserver.observe('(min-width: 1200px)')
    .subscribe(result => {
        this.is.xl = result.matches;
        this.changeScreenSizeSub.next();
    });
  }
}