import { Component, OnInit } from '@angular/core';
import { Courses } from '../../../interfaces/data';
import { CoursesService } from '../../../services/courses.service';
import { TeachersService } from '../../../services/teachers.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: Courses[] = [];

  constructor(
    private courseService: CoursesService,
    private teachersService: TeachersService
  ) {}

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCourses().subscribe((res: any[]) => {
      const tempCourses = res.map((doc: any) => {
        const data = doc.payload.doc.data();
        const id = doc.payload.doc.id;
        return { id, ...data } as Courses;
      });

      tempCourses.forEach((course) => {
  const names: string[] = [];

  if (course.COURSE_TEACHER?.length) {
    course.COURSE_TEACHER.forEach((t) => {
      if (t.id) {
        this.teachersService.getTeacherById(t.id).subscribe((teacher) => {
          if (teacher?.USER_NAME || teacher?.name) {
            names.push(teacher.USER_NAME || teacher.name);
            course['teacherNames'] = names.join(', ');
          }
        });
      }
    });
  } else {
    course['teacherNames'] = 'N/A';
  }
});

      this.courses = tempCourses;
    });
  }

  deleteCourse(course: Courses) {
    if (course.id) {
      this.courseService.deleteCourseEverywhere(course.id).then(() => {
        this.getCourses();
      });
    }
  }

  trackById(index: number, item: Courses) {
    return item.id;
  }
}
