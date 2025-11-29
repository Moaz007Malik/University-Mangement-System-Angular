import { Component, OnInit } from '@angular/core';
import { QuizzesService } from '../../services/quizzes.service';
import { Quiz, User, Courses } from '../../interfaces/data';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-internals',
  templateUrl: './internals.component.html',
})
export class InternalsComponent implements OnInit {
  quizzes: Quiz[] = [];
  courses: Courses[] = [];
  teacher!: User;

  newQuiz: Quiz = {
    title: '',
    type: 'quiz',
    courseId: '',
    teacherId: '',
    createdAt: new Date(),
    dueDate: '',
    description: '',
  };

  constructor(
    private quizzesService: QuizzesService,
    private coursesService: CoursesService
  ) {}

  selectedQuizId: string = '';
  selectedCourseStudents: { studentId: string; studentName: string }[] = [];

  gradeEntries: { studentId: string; studentName: string; marks: number }[] =
    [];

  ngOnInit(): void {
    this.teacher = JSON.parse(localStorage.getItem('user') || '{}');
    this.newQuiz.teacherId = this.teacher.id;
    this.loadCourses();
    this.loadQuizzes();
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe((res) => {
      const coursesData = res.map((action: any) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data } as Courses;
      });
      this.courses = coursesData.filter((course) =>
        course.COURSE_TEACHER?.some((t: any) => t.id === this.teacher.id)
      );
    });
  }

  loadQuizzes() {
    this.quizzesService.getQuizzes().subscribe((data) => {
      this.quizzes = data.filter((q) => q.teacherId === this.teacher.id);
    });
  }

  createQuiz() {
    if (
      this.newQuiz.title &&
      this.newQuiz.courseId &&
      this.newQuiz.dueDate &&
      this.newQuiz.description
    ) {
      this.newQuiz.createdAt = new Date();

      this.quizzesService.addQuiz(this.newQuiz).then(() => {
        this.newQuiz = {
          title: '',
          type: 'quiz',
          courseId: '',
          teacherId: this.teacher.id,
          createdAt: new Date(),
          dueDate: '',
          description: '',
        };
      });
    }
  }

  

  deleteQuiz(id: string) {
    if (confirm('Delete this quiz/assignment?')) {
      this.quizzesService.deleteQuiz(id);
    }
  }
}
