import { Component, OnInit } from '@angular/core';
import { Courses, User } from '../../../interfaces/data';
import { StudentsService } from '../../../services/students.service';
import { CoursesService } from '../../../services/courses.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
})
export class TeachersComponent implements OnInit {
  teachers: User[] = [];
  courses: Courses[] = [];
  selectedType: 'teacher' = 'teacher';

  constructor(
    private studentService: StudentsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getCourses();
  }

  getUsers() {
    this.studentService.getUsers().subscribe((res) => {
      this.teachers = res
        .map((e: any) => {
          const data = e.payload.doc.data() as User;
          data.id = e.payload.doc.id;
          return data;
        })
        .filter((user: User) => user.USER_TYPE === this.selectedType);
    });
  }

  getCourses() {
    this.coursesService.getCourses().subscribe((res) => {
      this.courses = res.map((e: any) => {
        const data = e.payload.doc.data() as Courses;
        data.id = e.payload.doc.id;
        return data;
      });
    });
  }

  updateTeacherCourse(user: User, selectedCourseId: string) {
    const selectedCourse = this.courses.find(
      (course) => course.id === selectedCourseId
    );
    if (!selectedCourse) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to assign course "${selectedCourse.COURSE_NAME}" to teacher "${user.USER_NAME}"?`
    );
    if (!confirmAdd) return;

    // Add course to teacher
    const updatedUser: User = { ...user };
    const teacherCourseIds = updatedUser.COURSES?.map((c) => c.id) || [];

    if (!teacherCourseIds.includes(selectedCourseId)) {
      updatedUser.COURSES = [
        ...(updatedUser.COURSES || []),
        { id: selectedCourseId },
      ];
    }

    // Add teacher to course
    const updatedCourse: Courses = { ...selectedCourse };
    const courseTeacherIds =
      updatedCourse.COURSE_TEACHER?.map((t) => t.id) || [];

    if (!courseTeacherIds.includes(user.id)) {
      updatedCourse.COURSE_TEACHER = [
        ...(updatedCourse.COURSE_TEACHER || []),
        { id: user.id },
      ];
    }

    Promise.all([
      this.studentService.updateUsers(updatedUser),
      this.coursesService.updateCourses(updatedCourse),
    ]).then(() => {
      this.getUsers();
      this.getCourses();
    });
  }

  removeCourseFromTeacher(user: User, courseId: string) {
    const affectedCourse = this.courses.find(
      (course) => course.id === courseId
    );
    if (!affectedCourse) return;

    const confirmRemove = window.confirm(
      `Are you sure you want to remove course "${affectedCourse.COURSE_NAME}" from teacher "${user.USER_NAME}"?`
    );
    if (!confirmRemove) return;

    // Remove course from teacher
    const updatedUser: User = { ...user };
    updatedUser.COURSES = (user.COURSES || []).filter(
      (c) => c.id.trim() !== courseId
    );

    // Remove teacher from course
    const updatedCourse: Courses = { ...affectedCourse };
    updatedCourse.COURSE_TEACHER = (updatedCourse.COURSE_TEACHER || []).filter(
      (teacher: any) => teacher.id !== user.id
    );

    // Update both in parallel
    Promise.all([
      this.studentService.updateUsers(updatedUser),
      this.coursesService.updateCourses(updatedCourse),
    ]).then(() => {
      this.getUsers();
      this.getCourses();
    });
  }

  deleteUser(user: User) {
    this.studentService.deleteUsers(user.id).then(() => {
      this.getUsers();
    });
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  getCourseNameById(id: string): string {
    const teacher = this.courses.find((t) => t.id === id);
    return teacher ? teacher.COURSE_NAME : id;
  }
}
