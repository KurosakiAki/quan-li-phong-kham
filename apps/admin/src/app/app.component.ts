import { Component } from '@angular/core';
import { AppTranslateService } from './common/services/app-translate.service';
import { PrintService } from './features/print-page/print.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    translate: AppTranslateService,
    public printService: PrintService
  ) {
    translate.init();
  }
}
