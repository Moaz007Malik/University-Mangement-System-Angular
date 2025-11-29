import { Component, OnInit } from '@angular/core';
import { Courses, User } from '../../interfaces/data';
import { StudentsService } from '../../services/students.service';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  singleUser!: User;
  showEditForm = false;
  userId: string = '';
  courses: Courses[] = [];

  constructor(
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private courseService: CoursesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = id;
      this.loadUser(id);
      this.loadAllCourses();
    }
  }

  isFaculty(user: User | undefined): boolean {
    return user?.USER_TYPE === 'faculty';
  }

  loadUser(id: string) {
    this.studentService.getSingleUser(id).subscribe({
      next: (user) => {
        if (user && typeof user === 'object') {
          this.singleUser = { ...(user as User), id }; // ensure all User properties are present
        } else {
          this.singleUser = {
            id,
            USER_ID: 0,
            USER_NAME: '',
            USER_EMAIL: '',
            USER_PASSWORD: '',
            USER_TYPE: 'student',
            IS_AUTH_TO_REG: false,
            COURSES: [],
          };
        }
      },
      error: (err) => {
        console.error('User not found', err);
      },
    });
  }

  loadAllCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.map((course: any) => {
          const data = course.payload.doc.data();
          const id = course.payload.doc.id;
          return { id, ...data } as Courses;
        });
      },
      error: (err) => console.error('Failed to fetch courses', err),
    });
  }

  updateUser(data: User) {
    data.id = this.singleUser.id;

    if (!data.IS_AUTH_TO_REG) {
      data.COURSES = this.singleUser.COURSES;
    }

    this.studentService.updateUsers(data).then(() => {
      this.showEditForm = false;
    });
  }

  toggleEditForm() {
    this.showEditForm = true;
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  getCourseNameById(courseId: string): string {
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.COURSE_NAME : courseId;
  }
}
