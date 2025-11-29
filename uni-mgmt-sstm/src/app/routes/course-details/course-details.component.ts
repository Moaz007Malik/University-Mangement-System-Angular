import { Component, OnInit } from '@angular/core';
import { Courses, User } from '../../interfaces/data';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  singleCourse!: Courses & { id?: string };
  showEditForm = false;

  teachersList: User[] = [];
  studentsList: User[] = [];

  selectedTeacher!: User;

  constructor(
    private afs: AngularFirestore,
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCourse(id);
    }

    this.studentsService.getUsers().subscribe((actions) => {
      const users = actions.map((action: any) => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data } as User;
      });
      this.teachersList = users.filter((u) => u.USER_TYPE === 'teacher');
      this.studentsList = users.filter((u) => u.USER_TYPE === 'student');
    });
  }

  fetchCourse(id: string) {
    this.afs
      .collection('courses')
      .doc(id)
      .valueChanges({ idField: 'id' })
      .subscribe((data: any) => {
        this.singleCourse = data;

        if (typeof this.singleCourse.COURSE_STUDENTS === 'string') {
          this.singleCourse.COURSE_STUDENTS = (
            this.singleCourse.COURSE_STUDENTS as string
          )
            .split(',')
            .map((s: string) => {
              const studentId = s.trim();
              const student = this.studentsList.find(
                (stu) => stu.id === studentId
              );
              return {
                studentId,
                studentName: student ? student.USER_NAME : '',
              };
            });
        }
      });
  }

  getTeacherNameById(id: string): string {
    const teacher = this.teachersList.find((t) => t.id === id);
    return teacher ? teacher.USER_NAME : id;
  }

  getStudentNameById(id: string): string {
    const student = this.studentsList.find((t) => t.id === id);
    return student ? student.USER_NAME : id;
  }

  updateCourse(updatedData: Courses) {
    if (!this.singleCourse.id) return;

    const courseId = this.singleCourse.id;
    const newTeacherId = updatedData.COURSE_TEACHER?.[0]?.id;
    const oldTeacherId = this.singleCourse.COURSE_TEACHER?.[0]?.id;

    this.afs
      .collection('courses')
      .doc(courseId)
      .update(updatedData)
      .then(() => {
        this.showEditForm = false;

        // Remove course from old teacher if changed
        if (oldTeacherId && oldTeacherId !== newTeacherId) {
          this.removeCourseFromTeacher(oldTeacherId, courseId);
        }

        // Add course to new teacher
        if (newTeacherId) {
          this.addCourseToTeacher(newTeacherId, courseId);
        }
      });
  }

  addCourseToTeacher(teacherId: string, courseId: string) {
    const userRef = this.afs.collection('users').doc(teacherId);

    userRef.get().subscribe((doc) => {
      const userData = doc.data() as User;

      let courses = userData.COURSES || [];

      const alreadyExists = courses.some((c) => c.id === courseId);
      if (!alreadyExists) {
        courses.push({ id: courseId });
        userRef.update({ COURSES: courses });
      }
    });
  }

  removeCourseFromTeacher(teacherId: string, courseId: string) {
    const userRef = this.afs.collection('users').doc(teacherId);

    userRef.get().subscribe((doc) => {
      const userData = doc.data() as User;

      const updatedCourses = (userData.COURSES || []).filter(
        (course) => course.id !== courseId
      );

      userRef.update({ COURSES: updatedCourses });
    });
  }

  toggleEditForm() {
    this.showEditForm = true;
  }

  onTeacherSelect(teacher: User) {
    this.selectedTeacher = teacher;
    this.singleCourse.COURSE_TEACHER = [
      {
        id: teacher.id,
      },
    ];
  }
}
