import { Component, OnInit } from '@angular/core';
import { GradesService } from '../../../services/grades.service';
import { CoursesService } from '../../../services/courses.service';
import { StudentsService } from '../../../services/students.service';
import { GradeEntry, User, Courses } from '../../../interfaces/data';

@Component({
  selector: 'app-all-internals',
  templateUrl: './all-internals.component.html',
  styleUrls: ['./all-internals.component.css'],
})
export class AllInternalsComponent implements OnInit {
  groupedByTeacher: { [teacherId: string]: GradeEntry[] } = {};
  users: { [id: string]: User } = {};
  courses: { [id: string]: Courses } = {};

  constructor(
    private gradesService: GradesService,
    private studentsService: StudentsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    // Load users
    this.studentsService.getUsers().subscribe((actions) => {
      actions.forEach((action) => {
        const data = action.payload.doc.data() as any;
        const id = action.payload.doc.id;
        this.users[id] = {
          id: id,
          USER_ID: data?.USER_ID || id,
          USER_NAME: data?.USER_NAME || '',
          USER_EMAIL: data?.USER_EMAIL || '',
          USER_PASSWORD: data?.USER_PASSWORD || '',
          USER_TYPE: data?.USER_TYPE || '',
          IS_AUTH_TO_REG: data?.IS_AUTH_TO_REG ?? false,
          COURSES: data?.COURSES ?? [],
        };
      });
    });

    // Load courses
    this.coursesService.getCourses().subscribe((actions) => {
      actions.forEach((action) => {
        const data = action.payload.doc.data() as any;
        const id = action.payload.doc.id;
        this.courses[id] = {
          id: id,
          COURSE_ID: data?.COURSE_ID || id,
          COURSE_NAME: data?.COURSE_NAME || '',
          COURSE_DESC: data?.COURSE_DESC || '',
          COURSE_CODE: data?.COURSE_CODE || '',
          COURSE_TEACHER: data?.COURSE_TEACHER || [],
          COURSE_STUDENTS: data?.COURSE_STUDENTS || [],
        };
      });

      // After courses loaded, load grades
      this.gradesService.getGrades().subscribe((grades) => {
        this.groupedByTeacher = {};

        grades.forEach((grade) => {
          const course = this.courses[grade.courseId];
          if (course && course.COURSE_TEACHER) {
            course.COURSE_TEACHER.forEach((teacher) => {
              const teacherId = teacher.id;
              if (!this.groupedByTeacher[teacherId]) {
                this.groupedByTeacher[teacherId] = [];
              }
              this.groupedByTeacher[teacherId].push(grade);
            });
          }
        });
      });
    });
  }

  getTeacherIds(): string[] {
    return Object.keys(this.groupedByTeacher);
  }

  getStudentName(id: string): string {
    return this.users[id]?.USER_NAME || id;
  }

  getCourseName(id: string): string {
    return this.courses[id]?.COURSE_NAME || id;
  }

  getUserName(id: string): string {
    return this.users[id]?.USER_NAME || id;
  }

  filterGrades(grades: GradeEntry[], type: 'quiz' | 'assignment') {
    return grades.filter((g) => g.type.toLowerCase() === type);
  }
}
