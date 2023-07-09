import { Component } from '@angular/core';
import { AppTranslateService } from './common/services/app-translate.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(translate: AppTranslateService) {
    translate.init();
  }
}
