import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  identifier = '';
  password = '';
  loginMethod: 'email' | 'userid' = 'userid';

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  formatUserId() {
    if (this.loginMethod === 'email') return;

    const digitsOnly = this.identifier.replace(/\D/g, '');

    if (digitsOnly.length <= 2) {
      this.identifier = digitsOnly;
    } else {
      const part1 = digitsOnly.slice(0, 2);
      const part2 = digitsOnly.slice(2, 6);
      this.identifier = part2 ? `${part1}-${part2}` : part1;
    }
  }

  onLogin() {
    if (!this.identifier || !this.password) {
      alert('Please enter your credentials.');
      return;
    }

    const trimmed = this.identifier.trim();
    const cleaned = this.loginMethod === 'email' ? trimmed : trimmed.replace(/-/g, '');

    const field = this.loginMethod === 'email' ? 'USER_EMAIL' : 'USER_ID';

    this.firestore
      .collection('users', (ref) => ref.where(field, '==', cleaned).limit(1))
      .get()
      .subscribe((snapshot) => {
        if (snapshot.empty) {
          alert('User not found.');
          return;
        }

        const userData: any = snapshot.docs[0].data();
        const role = userData.USER_TYPE;

        if (!role) {
          alert('User role not set.');
          return;
        }

        this.authService.login(cleaned, this.password.trim(), role, this.loginMethod);
      });
  }
}
