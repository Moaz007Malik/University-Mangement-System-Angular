import { Component, OnInit } from '@angular/core';
import { Courses, User } from '../../../interfaces/data';
import { StudentsService } from '../../../services/students.service';
import { CoursesService } from '../../../services/courses.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students: User[] = [];
  courses: Courses[] = [];
  selectedType = 'student';

  constructor(
    private studentService: StudentsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getCourses();
  }

  getUser() {
    this.studentService.getUsers().subscribe((res) => {
      this.students = res
        .map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
        .filter((user: User) => user.USER_TYPE === this.selectedType);
    });
  }

  getCourses() {
    this.coursesService.getCourses().subscribe((res) => {
      this.courses = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    });
  }

  getCourseName(course: string | { id: string; name: string }): string {
    if (typeof course === 'string') {
      return course.trim();
    } else if (typeof course === 'object' && course.name) {
      return course.name.trim();
    }
    return '';
  }

  isCourseAssigned(student: User, course: Courses): boolean {
    return (
      student.COURSES?.some((c: any) => {
        return (typeof c === 'object' ? c.id : c) === course.id;
      }) ?? false
    );
  }

  updateStudentCourse(user: User, selectedCourseId: string) {
    const selectedCourse = this.courses.find(
      (course) => course.id === selectedCourseId
    );
    if (!selectedCourse) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to add the course "${selectedCourse.COURSE_NAME}" for ${user.USER_NAME}?`
    );
    if (!confirmAdd) return;

    const updatedUser: User = { ...user };
    const userCourses: any[] = updatedUser.COURSES || [];

    // Prevent duplicate entries
    if (!userCourses.some((c) => c.id === selectedCourse.id)) {
      userCourses.push({
        id: selectedCourse.id,
        name: selectedCourse.COURSE_NAME,
      });
      updatedUser.COURSES = userCourses;
    }

    this.studentService.updateUsers(updatedUser).then(() => {
      this.getUser();

      const updatedCourse: Courses = { ...selectedCourse };
      const courseStudents: { studentId: string }[] = Array.isArray(
        updatedCourse.COURSE_STUDENTS
      )
        ? [...updatedCourse.COURSE_STUDENTS]
        : [];

      if (!courseStudents.some((s) => s.studentId === updatedUser.id)) {
        courseStudents.push({
          studentId: updatedUser.id,
        });
        updatedCourse.COURSE_STUDENTS = courseStudents;
      }

      this.coursesService.updateCourses(updatedCourse).then(() => {
        this.getCourses();
      });
    });
  }

  removeCourseFromStudent(user: User, id: string) {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove the course "${this.getCourseNameById(
        id
      )}" from ${user.USER_NAME}?`
    );
    if (!confirmRemove) return;

    const updatedUser: User = { ...user };

    // Remove course from student's COURSES array
    updatedUser.COURSES = (user.COURSES || []).filter((c: any) => {
      return c.id !== id;
    });

    this.studentService.updateUsers(updatedUser).then(() => {
      this.getUser();

      // Find course object by course name
      const affectedCourse = this.courses.find((course) => course.id === id);
      if (!affectedCourse) return;

      const updatedCourse: Courses = { ...affectedCourse };

      updatedCourse.COURSE_STUDENTS = (
        Array.isArray(updatedCourse.COURSE_STUDENTS)
          ? updatedCourse.COURSE_STUDENTS
          : []
      ).filter(
        (student: any) =>
          typeof student === 'object' && student.studentId !== user.id
      );

      this.coursesService.updateCourses(updatedCourse).then(() => {
        this.getCourses();
      });
    });
  }

  deleteUser(user: User) {
    this.studentService.deleteUsers(user.id).then(() => {
      this.getUser();
    });
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  trackById(index: number, item: User) {
    return item.id;
  }

  getCourseNameById(id: string): string {
    const teacher = this.courses.find((t) => t.id === id);
    return teacher ? teacher.COURSE_NAME : id;
  }
}
