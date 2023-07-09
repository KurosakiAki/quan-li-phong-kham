import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { AuthActions } from '.';


export const authFeatureKey = 'auth';

export interface AuthState extends EntityState<any> {
  isLoadedAll: boolean
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({

})

export const initialState: AuthState = adapter.getInitialState({
  isLoadedAll: false
})

export const AuthReducer = createReducer(
  initialState,

  on(AuthActions.changePasswordSuccessed, (state, {}) => {
    return state;
  }),
  
  on(AuthActions.forgotPasswordSuccessed, (state, {}) => {
    return state;
  }),

  on(AuthActions.verifyCodeSuccessed, (state, {}) => {
    return state;
  }),

  on(AuthActions.registerSuccessed, (state, {}) => {
    return state;
  }),

  on(AuthActions.loginSuccessed, (state, {}) => {
    return state;
  }),

  on(AuthActions.logout, (state, {}) => {
    return state;
  }),

  on(AuthActions.resetPasswordSuccessed, (state, {}) => {
    return state;
  }),
);
