import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-teacher-sidebar',
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css'],
})
export class TeacherSidebarComponent implements OnInit {
  isCollapsed = false;
  showLogoutConfirm = false;
  teacherId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.teacherId = user?.id || null;
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
