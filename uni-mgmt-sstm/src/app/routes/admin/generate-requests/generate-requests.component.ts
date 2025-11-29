import { Component, OnInit } from '@angular/core';
import { StudentRequestsService } from '../../../services/student-requests.service';
import { CourseRequest } from '../../../interfaces/data';
import { CoursesService } from '../../../services/courses.service';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from 'src/app/services/students.service';
import { firstValueFrom } from 'rxjs';
import { GradesService } from 'src/app/services/grades.service';

@Component({
  selector: 'app-generate-requests',
  templateUrl: './generate-requests.component.html',
})
export class GenerateRequestsComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId: string = '';
  selectedCourse: any = null;
  selectedCourseName: string = '';
  requestType: 'enroll' | 'drop' = 'enroll';
  remainingCourseSlots: number = 0;
  totalMarks: number = 0;
  canDirectEnroll: boolean = false;

  hasPendingRequest = false;
  pendingRequestMessage = '';

  studentsInSelectedCourse: any[] = [];
  currentStudent: any;
  studentRequests: CourseRequest[] = [];
  showAll = false;

  constructor(
    private requestsService: StudentRequestsService,
    private coursesService: CoursesService,
    private authService: AuthService,
    private studentsService: StudentsService,
    private route: ActivatedRoute,
    private gradesService: GradesService
  ) {}

  ngOnInit(): void {
    const studentIdFromRoute = this.route.snapshot.paramMap.get('id');

    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.currentStudent = user;

        const studentId = studentIdFromRoute || this.currentStudent?.id;

        if (studentId && !this.currentStudent?.USER_NAME) {
          this.studentsService.getSingleUser(studentId).subscribe((student) => {
            this.currentStudent = { ...student, id: studentId };
            this.loadStudentRequests(studentId);
            this.calculateRemainingCourseSlots(studentId);
            this.loadGrades(studentId);
          });
        } else {
          this.loadStudentRequests(this.currentStudent.id);
          this.calculateRemainingCourseSlots(this.currentStudent.id);
          this.loadGrades(this.currentStudent.id);
        }
      }
    });

    this.coursesService.getCourses().subscribe((snapshot) => {
      this.courses = snapshot.map((docChange) => {
        const data = docChange.payload.doc.data();
        const id = docChange.payload.doc.id;
        return typeof data === 'object' && data !== null
          ? { id, ...data }
          : { id };
      });
    });
  }
  
  loadGrades(studentId: string) {
    this.gradesService.getGradesForStudent(studentId).subscribe((grades) => {
      this.totalMarks = grades.reduce((sum, g) => sum + g.marks, 0);
      this.canDirectEnroll = this.totalMarks >= 60;
    });
  }

  loadStudentRequests(studentId: string) {
    this.requestsService
      .getRequestsByStudent(studentId)
      .subscribe((requests) => {
        this.studentRequests = requests.sort((a, b) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
      });
  }

  loadStudentsInCourse(courseId: string) {
    this.coursesService
      .getSingleCourse(courseId)
      .subscribe(async (courseData: any) => {
        const enrolled = courseData?.COURSE_STUDENTS || [];

        if (!enrolled.length) {
          this.studentsInSelectedCourse = [];
          return;
        }

        try {
          const studentsWithNames = await Promise.all(
            enrolled.map(async (s: any) => {
              const studentData = await firstValueFrom(
                this.studentsService.getSingleUser(s.studentId)
              );
              return {
                studentId: s.studentId,
                studentName: studentData?.USER_NAME || 'Unnamed Student',
              };
            })
          );

          this.studentsInSelectedCourse = studentsWithNames;
        } catch (error) {
          console.error('Error loading student names:', error);
          this.studentsInSelectedCourse = [];
        }
      });
  }

  async calculateRemainingCourseSlots(studentId: string) {
    try {
      const studentData = await firstValueFrom(
        this.studentsService.getSingleUser(studentId)
      );
      const currentCourses = studentData?.COURSES || [];
      this.remainingCourseSlots = 6 - currentCourses.length;
      if (this.remainingCourseSlots < 0) this.remainingCourseSlots = 0;
    } catch (error) {
      console.error('Error calculating remaining slots:', error);
      this.remainingCourseSlots = 0;
    }
  }

  onCourseSelect(course: any) {
    this.selectedCourse = course;
    this.selectedCourseId = course?.id || '';
    this.selectedCourseName = course?.COURSE_NAME || '';
    this.requestType = 'enroll';

    if (this.selectedCourseId) {
      this.loadStudentsInCourse(this.selectedCourseId);
    }

    this.evaluateRequestOptions();
  }

  evaluateRequestOptions() {
    this.hasPendingRequest = false;
    this.pendingRequestMessage = '';

    if (!this.selectedCourseId || !this.currentStudent?.id) return;

    this.requestsService
      .getRequestsByStudent(this.currentStudent.id)
      .subscribe((requests) => {
        const courseRequests = requests
          .filter((req) => req.courseId === this.selectedCourseId)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

        const latestPending = courseRequests.find(
          (req) => req.status === 'pending'
        );

        if (latestPending) {
          this.hasPendingRequest = true;
          this.pendingRequestMessage = `You already have a pending request to ${latestPending.type} this course.`;
          return;
        }

        this.coursesService
          .getSingleCourse(this.selectedCourseId)
          .subscribe((courseData: any) => {
            const enrolledStudents = courseData?.COURSE_STUDENTS || [];
            const isEnrolled = enrolledStudents.some(
              (s: any) => s.studentId === this.currentStudent.id
            );

            if (isEnrolled && this.requestType === 'enroll') {
              this.hasPendingRequest = true;
              this.pendingRequestMessage = `You are already enrolled in this course.`;
            }

            if (!isEnrolled && this.requestType === 'drop') {
              this.hasPendingRequest = true;
              this.pendingRequestMessage = `You are not enrolled in this course, so you can't drop it.`;
            }
          });
      });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  submitRequest() {
    if (!this.selectedCourse || !this.currentStudent) return;

    const courseId = this.selectedCourse.id;
    const studentId = this.currentStudent.id;

    if (this.canDirectEnroll) {
      this.coursesService;
      this.coursesService
        .addStudentAndUpdateUser(this.selectedCourse.id, {
          studentId: this.currentStudent.id,
          studentName: this.currentStudent.USER_NAME,
        })
        .then(() => {
          console.log('✅ Student enrolled and user updated.');
        })
        .catch((err) => {
          console.error('❌ Error:', err);
        });
    } else {
      const request: CourseRequest = {
        studentId: studentId,
        studentName: this.currentStudent.USER_NAME,
        courseId: courseId,
        courseName: this.selectedCourse.COURSE_NAME,
        type: 'enroll',
        status: 'pending',
        timestamp: new Date(),
      };

      this.requestsService
        .createRequest(request)
        .then(() => {
          console.log('✅ Request submitted.');
        })
        .catch((err) => {
          console.error('❌ Error submitting request:', err);
        });
    }
  }
}
