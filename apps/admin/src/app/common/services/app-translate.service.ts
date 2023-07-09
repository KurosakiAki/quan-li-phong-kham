import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AppTranslateService {
    lang = 'vi';

    constructor(
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) { 

    }

    init() {
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translateService.setDefaultLang('vi');

        const lang = this.localStorageService.getItem('lang') || 'vi';
        this.selectLang(lang);
    }

    /**
    * Select language
    * @param {'vi' | 'en'} lang Language
    */
    selectLang(lang: string) {
        this.lang = lang;
        this.translateService.use(lang);
        this.localStorageService.setItem('lang', lang);
    }
}