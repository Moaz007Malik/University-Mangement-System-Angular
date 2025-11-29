import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // adjust path as needed

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./routes/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard],
    data: { roles: ['faculty'] }
  },
  {
    path: '',
    loadComponent: () => import('./routes/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./routes/admin/students/students.component').then(m => m.StudentsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['faculty'] }
  }
];
