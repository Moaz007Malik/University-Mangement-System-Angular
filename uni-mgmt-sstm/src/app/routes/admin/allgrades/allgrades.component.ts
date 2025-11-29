import { Component, OnInit } from '@angular/core';
import { GradesService } from '../../../services/grades.service';
import { StudentsService } from '../../../services/students.service';
import { GradeEntry, User } from '../../../interfaces/data';
import { CoursesService } from '../../../services/courses.service';

@Component({
  selector: 'app-allgrades',
  templateUrl: './allgrades.component.html',
  styleUrls: ['./allgrades.component.css'],
})
export class AllgradesComponent implements OnInit {
  groupedGrades: { [studentId: string]: GradeEntry[] } = {};
  studentNames: { [id: string]: string } = {};
  courseNames: { [id: string]: string } = {};

  constructor(
    private gradesService: GradesService,
    private studentsService: StudentsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    // Grades
    this.gradesService.getGrades().subscribe((grades) => {
      this.groupedGrades = {};
      grades.forEach((grade) => {
        if (!this.groupedGrades[grade.studentId]) {
          this.groupedGrades[grade.studentId] = [];
        }
        this.groupedGrades[grade.studentId].push(grade);
      });
    });

    // Students
    this.studentsService.getUsers().subscribe((actions: any[]) => {
      const students: User[] = actions.map((action) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data } as User;
      });
      students.forEach((student) => {
        this.studentNames[student.id] = student.USER_NAME;
      });
    });

    // Courses
    this.coursesService.getCourses().subscribe((actions: any[]) => {
      actions.forEach((action) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        this.courseNames[id] = data.COURSE_NAME;
      });
    });
  }

  getStudentIds(): string[] {
    return Object.keys(this.groupedGrades);
  }

  getTotalMarks(grades: GradeEntry[]): number {
    return grades.reduce((sum, g) => sum + g.marks, 0);
  }

  getStudentName(studentId: string): string {
    return this.studentNames[studentId] || studentId;
  }

  getCourseName(courseId: string): string {
    return this.courseNames[courseId] || courseId;
  }

  downloadGradesPDF(): void {
    const url = `https://localhost:7235/grades/report/student/all`;
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `All Students Grades.pdf`;
        a.click();
      })
      .catch((err) => {
        console.error('Failed to download PDF:', err);
        alert('Error downloading PDF. Please try again later.');
      });
  }
}
