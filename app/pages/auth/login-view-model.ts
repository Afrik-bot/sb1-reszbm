import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class LoginViewModel extends Observable {
  private authService: AuthService;
  email: string = '';
  password: string = '';

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  async onLogin() {
    try {
      if (!this.email || !this.password) {
        throw new Error('Please enter both email and password');
      }

      const user = await this.authService.signInWithEmail(this.email, this.password);
      if (user) {
        // Navigate to home page
        // TODO: Implement navigation
      }
    } catch (error) {
      console.error('Login error:', error);
      // TODO: Show error dialog
    }
  }

  onSignUpTap() {
    // Navigate to sign up page
    // TODO: Implement navigation
  }

  async onGoogleSignIn() {
    // TODO: Implement Google Sign In
  }
}