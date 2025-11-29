import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { QuizzesService } from '../../services/quizzes.service';
import { GradesService } from '../../services/grades.service';
import { Courses, Quiz, GradeEntry, User } from '../../interfaces/data';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-teacher-grades',
  templateUrl: './teacher-grades.component.html',
})
export class TeacherGradesComponent implements OnInit {
  teacher!: User;
  courses: Courses[] = [];
  selectedCourseId: string = '';
  quizzes: Quiz[] = [];
  selectedQuizId: string = '';
  selectedQuiz!: Quiz;
  students: string[] = [];
  studentsList: User[] = [];

  gradeEntries: {
    studentId: string;
    marks: number;
    gradeId?: string;
  }[] = [];

  constructor(
    private coursesService: CoursesService,
    private quizzesService: QuizzesService,
    private gradesService: GradesService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.teacher = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe((res) => {
      const data = res.map((action: any) => {
        const course = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...course } as Courses;
      });
      this.courses = data.filter((c) =>
        c.COURSE_TEACHER?.some((t: any) => t.id === this.teacher.id)
      );
    });
  }

  onCourseSelect() {
    this.quizzesService.getQuizzes().subscribe((res) => {
      this.quizzes = res.filter(
        (q) =>
          q.courseId === this.selectedCourseId &&
          q.teacherId === this.teacher.id
      );
    });

    const selectedCourse = this.courses.find(
      (c) => c.id === this.selectedCourseId
    );

    this.students = (selectedCourse?.COURSE_STUDENTS || []).map(
      (student: any) => student.studentId
    );

    this.studentsList = [];

    this.students.forEach((studentId) => {
      this.firestore
        .collection('users')
        .doc(studentId)
        .get()
        .subscribe((doc) => {
          if (doc.exists) {
            const userData = doc.data() as User;
            this.studentsList.push({ ...userData, id: doc.id });
          }
        });
    });

    this.selectedQuizId = '';
    this.gradeEntries = [];
  }

  onQuizSelect() {
    const quiz = this.quizzes.find((q) => q.id === this.selectedQuizId);
    if (!quiz) return;

    this.selectedQuiz = quiz;

    this.gradesService.getGrades().subscribe((grades) => {
      const quizGrades = grades.filter(
        (g) =>
          g.courseId === this.selectedCourseId &&
          g.title === quiz.title &&
          g.type.toLowerCase() === quiz.type.toLowerCase()
      );

      this.gradeEntries = this.students.map((studentId) => {
        const existing = quizGrades.find((g) => g.studentId === studentId);
        return {
          studentId,
          marks: existing ? existing.marks : 0,
          gradeId: existing?.id,
        };
      });
    });
  }

  submitGrades() {
    const dateNow = new Date().toISOString().split('T')[0];

    this.gradeEntries.forEach((entry) => {
      const grade: GradeEntry = {
        studentId: entry.studentId,
        courseId: this.selectedCourseId,
        title: this.selectedQuiz.title,
        type: this.selectedQuiz.type === 'quiz' ? 'Quiz' : 'Assignment',
        date: dateNow,
        marks: entry.marks,
      };

      if (entry.gradeId) {
        this.gradesService.updateGrade({ ...grade, id: entry.gradeId });
      } else {
        this.gradesService.addGrade(grade);
      }
    });

    alert('Grades submitted successfully.');
    this.selectedQuizId = '';
    this.gradeEntries = [];
  }

  deleteGrade(gradeId: string) {
    if (confirm('Delete this grade?')) {
      this.gradesService.deleteGrade(gradeId).then(() => {
        this.onQuizSelect();
      });
    }
  }

  getStudentNameById(id: string): string {
    const student = this.studentsList.find((t) => t.id === id);
    return student ? student.USER_NAME : 'Loading...';
  }
}
