import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { WebFeatures } from '@api-interfaces';

import { AuthEffects, AuthReducer } from './features/auth/store';

@NgModule({
  imports: [
    StoreModule.forRoot({
      [WebFeatures.AUTH]: AuthReducer,
    }),
    EffectsModule.forRoot([
      AuthEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  exports: [],
  declarations: [],
  providers: [],
})
export class AppStoreModule { }
