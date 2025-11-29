import { Component, OnInit } from '@angular/core';
import { TimeSlot, Courses, User } from '../../interfaces/data';
import { TimeTableService } from '../../services/timetable.service';
import { CoursesService } from 'src/app/services/courses.service';
import { TeachersService } from 'src/app/services/teachers.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css'],
})
export class TimeTableComponent implements OnInit {
  Rooms: string[] = [
    'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6',
    'Room 7', 'Room 8', 'Room 9', 'Room 10', 'Room 11', 'Room 12'
  ];
  Days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  courses: Courses[] = [];
  teachers: User[] = [];
  timeSlots: TimeSlot[] = [];

  editingSlot: TimeSlot | null = null;

  newSlot: TimeSlot = {
    courseId: '',
    courseName: '',
    courseCode: '',
    teacherId: '',
    studentId: [],
    rooms: '',
    day: '',
    startTime: '',
    endTime: '',
  };

  constructor(
    private timeService: TimeTableService,
    private coursesService: CoursesService,
    private teachersService: TeachersService
  ) {}

  ngOnInit(): void {
    this.fetchTimeSlots();
    this.fetchTeachers();
    this.fetchCourses();
  }

  fetchTimeSlots() {
    this.timeService.getTimeSlots().subscribe((slots) => {
      this.timeSlots = slots;
    });
  }

  fetchTeachers() {
    this.teachersService.getTeachers().subscribe((teachers) => {
      this.teachers = teachers.map((teacher: any) => ({
        id: teacher.id,
        USER_ID: teacher.USER_ID,
        USER_NAME: teacher.USER_NAME,
        USER_EMAIL: teacher.USER_EMAIL,
        USER_PASSWORD: teacher.USER_PASSWORD,
        USER_TYPE: teacher.USER_TYPE ?? 'teacher',
        IS_AUTH_TO_REG: teacher.IS_AUTH_TO_REG,
        COURSES: teacher.COURSES,
      }));
    });
  }

  fetchCourses() {
    this.coursesService.getCourses().subscribe((res: any[]) => {
      this.courses = res.map((doc: any) => {
        const data = doc.payload.doc.data();
        const id = doc.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  onCourseSelect() {
    const course = this.courses.find((c) => c.id === this.newSlot.courseId);
    if (course) {
      this.newSlot.courseCode = course.COURSE_CODE;
      this.newSlot.courseName = course.COURSE_NAME;

      if (course.COURSE_TEACHER && course.COURSE_TEACHER.length > 0) {
        this.newSlot.teacherId = course.COURSE_TEACHER[0].id;
      } else {
        this.newSlot.teacherId = '';
      }

      this.newSlot.studentId =
        course.COURSE_STUDENTS?.map((s: any) => s.studentId) || [];
    }
  }

  addTimeSlot() {
    if (!this.newSlot.courseId || !this.newSlot.day) return;

    const course = this.courses.find((c) => c.id === this.newSlot.courseId);
    if (course) {
      this.newSlot.courseCode = course.COURSE_CODE;
      this.newSlot.courseName = course.COURSE_NAME;
      this.newSlot.studentId =
        course.COURSE_STUDENTS?.map((s: any) => s.studentId) || [];
    }

    this.timeService.addTimeSlot(this.newSlot).then(() => {
      this.newSlot = {
        courseId: '',
        courseName: '',
        courseCode: '',
        teacherId: '',
        studentId: [],
        rooms: '',
        day: '',
        startTime: '',
        endTime: '',
      };
    });
  }

  deleteTimeSlot(id: string) {
    this.timeService.deleteTimeSlot(id);
  }

  toggleEdit(slot: TimeSlot) {
    this.editingSlot = { ...slot };
  }

  onEditCourseSelect() {
    if (!this.editingSlot) return;
    const course = this.courses.find((c) => c.id === this.editingSlot!.courseId);
    if (course) {
      this.editingSlot.courseCode = course.COURSE_CODE;
      this.editingSlot.courseName = course.COURSE_NAME;
      this.editingSlot.studentId =
        course.COURSE_STUDENTS?.map((s: any) => s.studentId) || [];
    }
  }

  updateTimeSlot(slot: TimeSlot) {
    if (!slot.courseId || !slot.day) return;
    this.timeService.updateTimeSlot(slot).then(() => {
      this.editingSlot = null;
    });
  }

  getTeacherName(id: string): string {
    const teacher = this.teachers.find((t) => t.id === id);
    return teacher ? teacher.USER_NAME : id;
  }

  getStudentTimeTable(studentId: string) {
    this.timeService.getTimeSlots().subscribe((slots) => {
      this.timeSlots = slots.filter(
        (slot) => Array.isArray(slot.studentId) && slot.studentId.includes(studentId)
      );
    });
  }
}
