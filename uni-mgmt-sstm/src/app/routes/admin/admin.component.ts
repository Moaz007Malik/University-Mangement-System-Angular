import { Component, OnInit } from '@angular/core';
import { CourseRequest, Courses, User } from '../../interfaces/data';
import { StudentsService } from '../../services/students.service';
import { CoursesService } from '../../services/courses.service';
import { StudentRequestsService } from 'src/app/services/student-requests.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  courses: Courses[] = [];
  users: User[] = [];
  courseRequests: CourseRequest[] = [];

  totalCourses = 0;
  totalStudents = 0;
  totalTeachers = 0;
  totalFaculty = 0;

  constructor(
    private studentService: StudentsService,
    private coursesService: CoursesService,
    private requestsService: StudentRequestsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchRequests();
  }

  fetchData(): void {
    this.studentService.getUsers().subscribe((res) => {
      this.users = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });

      this.totalStudents = this.users.filter(
        (u) => u.USER_TYPE === 'student'
      ).length;
      this.totalTeachers = this.users.filter(
        (u) => u.USER_TYPE === 'teacher'
      ).length;
      this.totalFaculty = this.users.filter(
        (u) => u.USER_TYPE === 'faculty'
      ).length;
    });

    this.coursesService.getCourses().subscribe((res) => {
      this.courses = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });

      this.totalCourses = this.courses.length;
    });
  }

  fetchRequests(): void {
    this.requestsService.getPendingRequests().subscribe((res) => {
      this.courseRequests = res;
    });
  }

  approveRequest(request: CourseRequest) {
    this.requestsService.approveRequest(request).then(() => {
      alert(
        `✅ Approved request for ${request.studentName} (${request.courseName})`
      );
      this.fetchRequests();
      this.fetchData();
    });
  }

  rejectRequest(request: CourseRequest) {
    this.requestsService.rejectRequest(request).then(() => {
      alert(
        `❌ Rejected request for ${request.studentName} (${request.courseName})`
      );
      this.fetchRequests();
    });
  }
}
