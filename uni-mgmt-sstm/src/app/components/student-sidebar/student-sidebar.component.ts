import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css'],
})
export class StudentSidebarComponent implements OnInit {
  isCollapsed = false;
  showLogoutConfirm = false;
  studentId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.studentId = user?.id || null;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  logout() {
    this.authService.logout();
    this.showLogoutConfirm = false;
  }
}
