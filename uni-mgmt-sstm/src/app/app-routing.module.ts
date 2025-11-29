import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // adjust path if needed

// Component Imports
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './routes/admin/admin.component';
import { StudentsComponent } from './routes/admin/students/students.component';
import { TeachersComponent } from './routes/admin/teachers/teachers.component';
import { FacultyComponent } from './routes/admin/faculty/faculty.component';
import { CoursesComponent } from './routes/admin/courses/courses.component';
import { AddUserComponent } from './routes/admin/add-user/add-user.component';
import { AddFacultyComponent } from './routes/admin/add-faculty/add-faculty.component';
import { AddCourseComponent } from './routes/admin/add-course/add-course.component';
import { FacultyProfileComponent } from './routes/faculty-profile/faculty-profile.component';
import { StudentProfileComponent } from './routes/student-profile/student-profile.component';
import { TeacherProfileComponent } from './routes/teacher-profile/teacher-profile.component';
import { UserProfileComponent } from './routes/user-profile/user-profile.component';
import { CourseDetailsComponent } from './routes/course-details/course-details.component';
import { SearchComponent } from './routes/search/search.component';
import { GenerateRequestsComponent } from './routes/admin/generate-requests/generate-requests.component';
import { TimeTableComponent } from './routes/time-table/time-table.component';
import { StudentTimeTableComponent } from './routes/student-time-table/student-time-table.component';
import { TeacherGradesComponent } from './routes/teacher-grades/teacher-grades.component';
import { AllgradesComponent } from './routes/admin/allgrades/allgrades.component';
import { TeacherTimeTableComponent } from './routes/teacher-time-table/teacher-time-table.component';
import { InternalsComponent } from './routes/internals/internals.component';
import { StudentInternalsComponent } from './routes/student-internals/student-internals.component';
import { StudentGradesComponent } from './routes/student-grades/student-grades.component';
import { AllInternalsComponent } from './routes/admin/all-internals/all-internals.component';
import { StudentCoursesComponent } from './routes/student-courses/student-courses.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] }},
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'teachers', component: TeachersComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'add-faculty', component: AddFacultyComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'add-course', component: AddCourseComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'faculty-profile/:id', component: FacultyProfileComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'student-profile/:id', component: StudentProfileComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] } },
  { path: 'teacher-profile/:id', component: TeacherProfileComponent, canActivate: [AuthGuard], data: { roles: ['teacher', 'faculty'] } },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'course-details/:id', component: CourseDetailsComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'generate-request/:id', component: GenerateRequestsComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] } },
  { path: 'student-courses/:id', component: StudentCoursesComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] } },
  { path: 'time-table', component: TimeTableComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'student-time-table/:id', component: StudentTimeTableComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] } },
  { path: 'teacher-time-table/:id', component: TeacherTimeTableComponent, canActivate: [AuthGuard], data: { roles: ['teacher', 'faculty'] } },
  { path: 'teacher-grades/:id', component: TeacherGradesComponent, canActivate: [AuthGuard], data: { roles: ['teacher', 'faculty'] }},
  { path: 'internals/:id', component: InternalsComponent, canActivate: [AuthGuard], data: { roles: ['teacher', 'faculty'] }},
  { path: 'student-internals/:id', component: StudentInternalsComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] }},
  { path: 'student-grades/:id', component: StudentGradesComponent, canActivate: [AuthGuard], data: { roles: ['student', 'faculty'] }},
  { path: 'grades', component: AllgradesComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] }},
  { path: 'all-internals', component: AllInternalsComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] }},

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
