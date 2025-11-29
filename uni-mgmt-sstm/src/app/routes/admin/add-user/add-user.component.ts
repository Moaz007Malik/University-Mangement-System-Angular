import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../services/students.service';
import { CoursesService } from '../../../services/courses.service';
import { Courses, User } from '../../../interfaces/data';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit {
  users: User[] = [];
  coursesList: Courses[] = [];
  selectedCourses: string[] = [];

  constructor(
    private studentService: StudentsService,
    private courseService: CoursesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((snapshot) => {
      this.coursesList = snapshot.map((doc) => {
        const data = doc.payload.doc.data() as Omit<Courses, 'id'>;
        const id = doc.payload.doc.id;
        return { ...data, id };
      });
    });
  }

  onCourseCheckboxChange(event: any) {
    const courseName = event.target.value;
    if (event.target.checked) {
      this.selectedCourses.push(courseName);
    } else {
      this.selectedCourses = this.selectedCourses.filter(
        (name) => name !== courseName
      );
    }
  }

  goBack(): void {
    this.location.back();
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  addUser(formData: any): void {
    const user: User = {
      ...formData,
      COURSES: this.selectedCourses,
      IS_AUTH_TO_REG: !!formData.IS_AUTH_TO_REG,
    };

    this.studentService.addUsers(user).then(() => {
      this.goBack(); // Go back after successful submission
    });
  }
}
