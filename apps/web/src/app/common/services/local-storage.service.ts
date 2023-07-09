const ACCESS_TOKEN_KEY = "access_token";
const URL_FROM_KEY = "url_from";

import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {
  constructor() { }
  
  /**
   *
   * @param key
   * @param value
   */
  setItem(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value)
      localStorage.setItem(key, jsonValue)
    } catch (e) {
      // saving error
    }
  };

  /**
   *
   * @param key
   * @returns json object | null
   */
  getItem(key: string) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : value;
    } catch (e) {
      return null;
    }
  }

  /**
   *
   * @param key
   */
  removeItem(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      // remove error
    }
  }

  /**
   * Get access token from storage
   * @returns
   */
  getAccessToken() {
    return this.getItem(ACCESS_TOKEN_KEY)
  }

  /**
   *
   * @param value Set access token to storage
   * @returns
   */
  setAccessToken(value: string) {
    return this.setItem(ACCESS_TOKEN_KEY, value)
  }

  /**
   * Remove access token from storage
   * @returns
   */
  removeAccessToken() {
    return this.removeItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Set url from (to redirect after login)
   * @param urlFrom
   * @returns
   */
  setUrlFrom(urlFrom: string) {
    return this.setItem(URL_FROM_KEY, urlFrom)
  }

  /**
   * Get url from to redirect
   * @returns
   */
  getUrlFromThenDel() {
    const urlFrom = this.getItem(URL_FROM_KEY)
    this.removeItem(URL_FROM_KEY)
    return urlFrom
  }
}

