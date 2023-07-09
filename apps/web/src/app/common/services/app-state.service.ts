import { Injectable, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { NgModule } from '@angular/core';

export class AppStateConfig {
    route403? = '/auth/403';
    /**
     * Cho phép chạy app ở chế độ đa ngôn ngữ
     */
    enableTranslate? = false;
    logoPath? = './assets/logo.png';
    homePageUrl? =  '/app/dat-lich-kham';
}


@Injectable({ providedIn: 'root' })
export class AppState {
    config = new AppStateConfig();

    constructor(@Optional() config?: AppStateConfig) {
        if (config) { this.config = {...this.config, ...config} }
    }

}

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
})
export class AppStateModule {
    constructor(@Optional() @SkipSelf() parentModule?: AppStateModule) {
        if (parentModule) {
            throw new Error(
                'AppStateModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: AppStateConfig): ModuleWithProviders<AppStateModule> {
        return {
            ngModule: AppStateModule,
            providers: [
                { provide: AppStateConfig, useValue: config }
            ]
        };
    }
}
