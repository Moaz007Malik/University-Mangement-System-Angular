import { Component, OnInit } from '@angular/core';
import { GradesService } from '../../services/grades.service';
import { GradeEntry, Courses } from '../../interfaces/data';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css'],
})
export class StudentGradesComponent implements OnInit {
  studentId: string = '';
  grades: GradeEntry[] = [];
  groupedGrades: { [courseName: string]: GradeEntry[] } = {};
  courseMap: { [id: string]: string } = {};

  constructor(
    private gradesService: GradesService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    const student = JSON.parse(localStorage.getItem('user') || '{}');
    this.studentId = student.id;

    this.coursesService.getMyCourses().subscribe((courses: Courses[]) => {
      this.courseMap = {};
      courses.forEach((course) => {
        this.courseMap[course.id] = course.COURSE_NAME;
      });

      this.gradesService.getGrades().subscribe((data) => {
        this.grades = data.filter((g) => g.studentId === this.studentId);

        this.groupedGrades = this.grades.reduce((acc, grade) => {
          const courseName = this.courseMap[grade.courseId] || 'Unknown Course';
          if (!acc[courseName]) {
            acc[courseName] = [];
          }
          acc[courseName].push(grade);
          return acc;
        }, {} as { [courseName: string]: GradeEntry[] });
      });
    });
  }

  downloadGradesPDF(): void {
    const url = `https://localhost:7235/grades/report/student/${this.studentId}`;
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `MyGrades_${this.studentId}.pdf`;
        a.click();
      })
      .catch((err) => {
        console.error('Failed to download PDF:', err);
        alert('Error downloading PDF. Please try again later.');
      });
  }
}
