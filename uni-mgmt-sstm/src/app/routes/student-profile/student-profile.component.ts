import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { User } from '../../interfaces/data';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
})
export class StudentProfileComponent implements OnInit {
  student!: User;
  showEditForm = false;
  userId: string = '';
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = id;
      this.studentService.getSingleUser(id).subscribe((data) => {
        if (data) {
          this.student = { ...(data as User), id: id.toString() };
        }
      });
    }
  }

  getCourseName(course: string | { id: string; name?: string }): string {
    if (typeof course === 'string') {
      return course.trim();
    } else if (typeof course === 'object') {
      return course.name ? course.name.trim() : course.id ? course.id : '';
    }
    return '';
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  updateStudent(data: User) {
    if (!data.IS_AUTH_TO_REG) {
      data.COURSES = this.student.COURSES;
    }

    this.studentService.updateUsers(data).then(() => {
      this.student = data;
      this.showEditForm = false;
    });
  }

  toggleEdit() {
    this.showEditForm = !this.showEditForm;
  }

  onCourseInputChange(value: string) {
    const courseNames = value
      .split(',')
      .map((name) => name.trim())
      .filter((name) => !!name);

    this.student.COURSES = courseNames.map((name, idx) => ({
      id: (idx + 1).toString(),
      name,
    }));
  }

  get courseNamesAsString(): string {
    return (
      this.student?.COURSES?.map((course) => this.getCourseName(course)).join(
        ', '
      ) || ''
    );
  }
}
