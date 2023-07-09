import { IChangePassword } from '@api-interfaces';
import { createAction, props } from '@ngrx/store';

export const changePassword = createAction(
  '[Auth / API] Change Password',
  props<{id: number, newPassword: IChangePassword}>()
)

export const changePasswordSuccessed = createAction(
  '[Auth / API] Change Password Successed',
)

export const changePasswordFailed = createAction(
  '[Auth / API] Change Password Failed',
  props<{error: any}>()
)

export const forgotPassword = createAction(
  '[Auth / API] Forgot Password',
  props<{data: any}>()
)

export const forgotPasswordSuccessed = createAction(
  '[Auth / API] Forgot Password Successed',
)

export const forgotPasswordFailed = createAction(
  '[Auth / API] Forgot Password Failed',
  props<{error: any}>()
)

export const resetPassword = createAction(
  '[Auth / API] Reset Password',
  props<{data: any}>()
)

export const resetPasswordSuccessed = createAction(
  '[Auth / API] Reset Password Successed',
)

export const resetPasswordFailed = createAction(
  '[Auth / API] Reset Password Failed',
  props<{error: any}>()
)

export const login = createAction(
  '[Auth / API] Login',
  props<{data: any}>()
)

export const loginSuccessed = createAction(
  '[Auth / API] Login Successed',
)

export const loginFailed = createAction(
  '[Auth / API] Login Failed',
  props<{error: any}>()
)

export const logout = createAction(
  '[Auth / API] Logout',
)

export const logoutSuccess = createAction(
  '[Auth / API] Logout Success',
)
