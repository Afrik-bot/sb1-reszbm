import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { Observable } from '@nativescript/core';

export class AuthService extends Observable {
  private static instance: AuthService;
  private auth: firebase.Auth;

  private constructor() {
    super();
    this.auth = firebase.auth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithEmail(email: string, password: string): Promise<firebase.User | null> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<firebase.User | null> {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser(): firebase.User | null {
    return this.auth.currentUser;
  }
}