import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { CoursesService } from '../../services/courses.service';
import { User, Courses } from '../../interfaces/data';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
})
export class TeacherProfileComponent implements OnInit {
  teacher!: User;
  showEditForm = false;
  userId: string = '';
  allCourses: Courses[] = [];
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    // Load courses first
    this.coursesService.getCourses().subscribe((res) => {
      this.allCourses = res.map((action: any) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data };
      });

      // Now fetch the teacher
      this.studentService.getSingleUser(this.userId).subscribe((data) => {
        if (data) {
          this.teacher = { ...(data as User), id: this.userId };
        }
      });
    });
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  getCourseName(courseId: string): string {
    const course = this.allCourses.find((c) => c.id === courseId);
    return course ? course.COURSE_NAME : 'Unknown Course';
  }

  updateTeacher(data: User) {
    this.studentService
      .updateUsers({ ...data, id: this.teacher.id })
      .then(() => {
        this.studentService.getSingleUser(this.teacher.id).subscribe((updatedUser) => {
          if (updatedUser) {
            this.teacher = updatedUser as User;
          }
          this.showEditForm = false;
        });
      });
  }

  toggleEdit() {
    this.showEditForm = !this.showEditForm;
  }
}
