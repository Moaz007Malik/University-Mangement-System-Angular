import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Courses, User } from '../../../interfaces/data';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StudentsService } from '../../../services/students.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
})
export class AddCourseComponent implements OnInit {
  teachers: User[] = [];
  students: User[] = [];
  totalCourses = 0;

  courseForm: FormGroup = new FormGroup({
    course_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    course_desc: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    course_code: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    course_teacher: new FormControl(null),
  });

  constructor(
    private firestore: AngularFirestore,
    private userService: StudentsService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((actions) => {
      const users = actions.map((action: any) => {
        return {
          id: action.payload.doc.id,
          ...action.payload.doc.data(),
        } as User;
      });
      this.teachers = users.filter((user) => user.USER_TYPE === 'teacher');
      this.students = users.filter((user) => user.USER_TYPE === 'student');
    });

    this.fetchTotalCourses();
  }

  get course_name() {
    return this.courseForm.get('course_name');
  }

  fetchTotalCourses() {
    this.firestore
      .collection('courses')
      .get()
      .subscribe((snapshot) => {
        this.totalCourses = snapshot.size;
      });
  }

  addCourse() {
    const formData = this.courseForm.value;
    const id = this.firestore.createId();

    const newCourse: Courses = {
      id: id,
      COURSE_ID: this.totalCourses + 1,
      COURSE_NAME: formData.course_name,
      COURSE_DESC: formData.course_desc,
      COURSE_CODE: formData.course_code,
      COURSE_TEACHER: [],
      COURSE_STUDENTS: [],
    };

    this.firestore
      .collection('courses')
      .doc(id)
      .set(newCourse)
      .then(() => {
        console.log('Course added!');
        this.reloadPage();
      });
  }

  reloadPage() {
    setTimeout(() => {
      window.location.href = '/courses';
    }, 100);
  }
}
