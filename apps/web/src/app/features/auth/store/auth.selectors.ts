import { WebFeatures } from '@api-interfaces';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(WebFeatures.AUTH);

export const {
  selectIds,
  selectEntities,
  selectAll
} = adapter.getSelectors(selectAuthState);

export const selectIsLoadAll = createSelector(
  selectAuthState,
  (state) => state.isLoadedAll
)