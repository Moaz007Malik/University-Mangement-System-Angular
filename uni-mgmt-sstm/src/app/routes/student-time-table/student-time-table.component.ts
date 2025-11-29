import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Teacher, TimeSlot } from '../../interfaces/data';
import { TimeTableService } from '../../services/timetable.service';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'app-student-time-table',
  templateUrl: './student-time-table.component.html',
  styleUrls: ['./student-time-table.component.css'],
})
export class StudentTimeTableComponent implements OnInit {
  studentId: string = '';
  timeSlots: TimeSlot[] = [];
  teachers: Teacher[] = [];
  studentCourses: string[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private timeService: TimeTableService,
    private teachersService: TeachersService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.studentId = id;

        // Load teachers
        this.teachersService.getTeachers().subscribe((t) => {
          this.teachers = t;

          // Get student data to retrieve course IDs
          this.timeService
            .getStudentById(this.studentId)
            .subscribe((student) => {
              if (student && Array.isArray(student.COURSES)) {
                this.studentCourses = student.COURSES.map((c: any) => c.id);
              }

              // Then load timetable
              this.loadStudentTimeTable();
            });
        });
      }
    });
  }

  loadStudentTimeTable() {
    this.timeService.getTimeSlots().subscribe((slots) => {
      this.timeSlots = slots.filter((slot) => {
        const enrolledStudents = Array.isArray(slot.studentId)
          ? slot.studentId
          : [];

        const isEnrolledInSlot = enrolledStudents.some((student: any) => {
          return typeof student === 'string'
            ? student === this.studentId
            : student.studentId === this.studentId;
        });

        const isEnrolledInCourse = this.studentCourses.includes(slot.courseId);

        return isEnrolledInSlot && isEnrolledInCourse;
      });

      this.isLoading = false;
    });
  }

  getTeacherName(id: string): string {
    const teacher = this.teachers.find((t) => t.id === id);
    return teacher ? teacher.USER_NAME : 'Unknown';
  }
}
