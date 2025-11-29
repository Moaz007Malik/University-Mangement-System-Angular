import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/data';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css'],
})
export class StudentCoursesComponent implements OnInit {
  student!: User;
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService
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

  get courseNamesAsString(): string {
    return (
      this.student?.COURSES?.map((course) => this.getCourseName(course)).join(
        ', '
      ) || ''
    );
  }
}
