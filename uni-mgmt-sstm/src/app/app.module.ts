import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { StudentsComponent } from './routes/admin/students/students.component';
import { LoginComponent } from './components/login/login.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './routes/admin/admin.component';
import { TeachersComponent } from './routes/admin/teachers/teachers.component';
import { FacultyComponent } from './routes/admin/faculty/faculty.component';
import { CoursesComponent } from './routes/admin/courses/courses.component';
import { AddCourseComponent } from './routes/admin/add-course/add-course.component';
import { AddUserComponent } from './routes/admin/add-user/add-user.component';
import { AddFacultyComponent } from './routes/admin/add-faculty/add-faculty.component';
import { CourseDetailsComponent } from './routes/course-details/course-details.component';
import { FacultyProfileComponent } from './routes/faculty-profile/faculty-profile.component';
import { SearchComponent } from './routes/search/search.component';
import { StudentProfileComponent } from './routes/student-profile/student-profile.component';
import { TeacherProfileComponent } from './routes/teacher-profile/teacher-profile.component';
import { UserProfileComponent } from './routes/user-profile/user-profile.component';
import { GenerateRequestsComponent } from './routes/admin/generate-requests/generate-requests.component';
import { TimeTableComponent } from './routes/time-table/time-table.component';
import { StudentSidebarComponent } from './components/student-sidebar/student-sidebar.component';
import { TeacherSidebarComponent } from './components/teacher-sidebar/teacher-sidebar.component';
import { StudentTimeTableComponent } from './routes/student-time-table/student-time-table.component';
import { TeacherGradesComponent } from './routes/teacher-grades/teacher-grades.component';
import { AllgradesComponent } from './routes/admin/allgrades/allgrades.component';
import { TeacherTimeTableComponent } from './routes/teacher-time-table/teacher-time-table.component';
import { InternalsComponent } from './routes/internals/internals.component';
import { StudentInternalsComponent } from './routes/student-internals/student-internals.component';
import { StudentGradesComponent } from './routes/student-grades/student-grades.component';
import { AllInternalsComponent } from './routes/admin/all-internals/all-internals.component';
import { StudentCoursesComponent } from './routes/student-courses/student-courses.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SidebarComponent,
    StudentsComponent,
    AdminComponent,
    TeachersComponent,
    FacultyComponent,
    CoursesComponent,
    AddCourseComponent,
    AddUserComponent,
    AddFacultyComponent,
    CourseDetailsComponent,
    FacultyProfileComponent,
    SearchComponent,
    StudentProfileComponent,
    TeacherProfileComponent,
    UserProfileComponent,
    GenerateRequestsComponent,
    TimeTableComponent,
    StudentSidebarComponent,
    TeacherSidebarComponent,
    StudentTimeTableComponent,
    TeacherGradesComponent,
    AllgradesComponent,
    TeacherTimeTableComponent,
    InternalsComponent,
    StudentInternalsComponent,
    StudentGradesComponent,
    AllInternalsComponent,
    StudentCoursesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    NgFor,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    FormsModule,
    AngularFireModule.initializeApp({
    apiKey: 'AIzaSyC-PEQkSDr915y3xoYWpymi_Ztv-m4leXw',
    authDomain: 'uni-mgmt-sstm.firebaseapp.com',
    projectId: 'uni-mgmt-sstm',
    storageBucket: 'uni-mgmt-sstm.firebasestorage.app',
    messagingSenderId: '413129146222',
    appId: '1:413129146222:web:8c237f65d78de80d878b7f',
  }),
    AngularFirestoreModule,
    
  ],
  providers: [
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
