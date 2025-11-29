// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private TOKEN_KEY = 'authToken';
  private TOKEN_EXP_KEY = 'authTokenExp';

  constructor(private firestore: AngularFirestore, private router: Router) {
    const savedUser = localStorage.getItem('user');
    const tokenValid = this.isTokenValid();

    if (savedUser && tokenValid) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    } else {
      this.logout(); // token expired or missing user
    }
  }

  login(identifier: string, password: string, role: string, loginMethod: 'email' | 'userid') {
    const usersRef = this.firestore.collection('users');
    const field = loginMethod === 'email' ? 'USER_EMAIL' : 'USER_ID';

    usersRef.ref
      .where(field, '==', identifier)
      .where('USER_PASSWORD', '==', password)
      .where('USER_TYPE', '==', role)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const user = { id: userDoc.id, ...(userDoc.data() as object) };

          localStorage.setItem('user', JSON.stringify(user));
          this.setToken(this.generateToken(), 60); // 60 minutes
          this.currentUserSubject.next(user);
          this.routeByUserType(user);
        } else {
          alert('Invalid credentials.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Something went wrong. Try again later.');
      });
  }

  private generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345.6789';
  let token = '';
  for (let i = 0; i < 256; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}


  private setToken(token: string, expiresInMinutes: number = 60) {
    const expiry = new Date().getTime() + expiresInMinutes * 60000;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXP_KEY, expiry.toString());
  }

  private isTokenValid(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXP_KEY);
    return !!token && expiry !== null && parseInt(expiry) > new Date().getTime();
  }

  getToken(): string | null {
    return this.isTokenValid() ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getCurrentUser() {
    return this.isTokenValid() ? this.currentUserSubject.value : null;
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXP_KEY);
    this.router.navigate(['/login']);
  }

  private routeByUserType(user: any): void {
    switch (user.USER_TYPE) {
      case 'faculty':
        this.router.navigate(['/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/student-profile', user.id]);
        break;
      case 'teacher':
        this.router.navigate(['/teacher-profile', user.id]);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
