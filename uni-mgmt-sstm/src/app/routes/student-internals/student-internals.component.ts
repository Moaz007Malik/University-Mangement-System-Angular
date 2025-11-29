import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizzesService } from '../../services/quizzes.service';
import { CoursesService } from '../../services/courses.service';
import { Quiz, Courses } from '../../interfaces/data';

@Component({
  selector: 'app-student-internals',
  templateUrl: './student-internals.component.html',
})
export class StudentInternalsComponent implements OnInit {
  studentId: string = '';
  courseMap: { [key: string]: string } = {};
  groupedQuizzes: { [courseName: string]: Quiz[] } = {};

  constructor(
    private route: ActivatedRoute,
    private quizzesService: QuizzesService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCoursesAndQuizzes();
  }

  loadCoursesAndQuizzes() {
    this.coursesService.getCourses().subscribe((res) => {
      const courses: Courses[] = res.map((action: any) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data };
      });

      const enrolledCourses = courses.filter((course) =>
        course.COURSE_STUDENTS?.some((s) => s.studentId === this.studentId)
      );

      // Create course map: id → COURSE_NAME
      this.courseMap = {};
      enrolledCourses.forEach((course) => {
        this.courseMap[String(course.id)] = course.COURSE_NAME;
      });

      const courseIds = Object.keys(this.courseMap);

      // Load quizzes and group them
      this.quizzesService.getQuizzes().subscribe((quizzes) => {
        const filteredQuizzes = quizzes.filter((q) =>
          courseIds.includes(q.courseId)
        );

        this.groupedQuizzes = filteredQuizzes.reduce((acc, quiz) => {
          const courseName = this.courseMap[quiz.courseId] || 'Unknown Course';
          if (!acc[courseName]) acc[courseName] = [];
          acc[courseName].push(quiz);
          return acc;
        }, {} as { [courseName: string]: Quiz[] });
      });
    });
  }
}
