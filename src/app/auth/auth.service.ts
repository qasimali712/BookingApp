// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = false;
  private _userId = 'abc';

  get userIsAuthentecated(){
    return this.user;
  }
  get userId(){
    return this._userId;
  }

  constructor() {
    // Check local storage for user authentication status
    const storedAuthStatus = localStorage.getItem('userIsAuthenticated');
    if (storedAuthStatus === 'true') {
      this.user = true;
    }
  }

  onLogin() {
    if (!this.user) {
      this.user = true;
      // Store user authentication status in local storage
      localStorage.setItem('userIsAuthenticated', 'true');
    }
  }
  onlogout() {
    this.user = false;
    // Remove user authentication status from local storage
    localStorage.removeItem('userIsAuthenticated');
  }
}
