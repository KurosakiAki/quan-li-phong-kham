import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { catchError, Observable, of } from 'rxjs';
import { AppStateModule } from './common/services/app-state.service';
import { AuthService } from './features/auth/auth.service';
import { ToastComponent } from './common/components/toast/toast.component';
import { AuthHeaderInterceptor } from './common/interceptors/auth-http.interceptor';
import {
  CustomDateParserFormatter,
  CustomDatePickerAdapter,
} from './common/services/datepicker-format.service';

import { registerLocaleData } from '@angular/common';
import localVi from '@angular/common/locales/vi';

registerLocaleData(localVi);

import { AppStoreModule } from './app-store.module';


function initializeAppFactory(authService: AuthService): () => Observable<any> {
  return () => authService.getCurrentuser().pipe(catchError((_) => of()));
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'vi',
    }),
    AppStateModule.forRoot({}),
    AppRoutingModule,
    AppStoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastComponent: ToastComponent,
    }),
    FontAwesomeModule,
    NgxDatatableModule,
    LoadingBarHttpClientModule,
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: LOCALE_ID, useValue: "vi-VN" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    { provide: NgbDateAdapter, useClass: CustomDatePickerAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
