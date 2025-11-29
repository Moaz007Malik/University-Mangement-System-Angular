import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { Courses } from '../interfaces/data';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private afs: AngularFirestore) {}

  getCourses() {
    return this.afs.collection('courses/').snapshotChanges();
  }

  getMyCourses(): Observable<Courses[]> {
    return this.afs.collection<Courses>('courses').valueChanges();
  }

  deleteCourses(id: string) {
    return this.afs.doc('courses/' + id).delete();
  }

  addCourses(user: any) {
    user.id = this.afs.createId();
    return this.afs.collection('courses/').add(user);
  }

  async addStudentAndUpdateUser(
    courseId: string,
    student: { studentId: string; studentName: string }
  ) {
    const courseRef = this.afs.collection('courses').doc(courseId);
    const studentRef = this.afs.collection('users').doc(student.studentId);

    const courseSnap = await firstValueFrom(courseRef.get());
    const studentSnap = await firstValueFrom(studentRef.get());

    const courseData = courseSnap.data() as {
      COURSE_STUDENTS?: any[];
      COURSE_NAME?: string;
    };
    const studentData = studentSnap.data() as { COURSES?: any[] };

    if (!courseData || !studentData) {
      throw new Error('Course or student not found');
    }

    // 1. Update course side
    const currentStudents = courseData.COURSE_STUDENTS || [];
    const isAlreadyInCourse = currentStudents.some(
      (s: any) => s.studentId === student.studentId
    );

    if (!isAlreadyInCourse) {
      currentStudents.push(student);
      await courseRef.update({ COURSE_STUDENTS: currentStudents });
    }

    // 2. Update user side
    const studentCourses = studentData.COURSES || [];
    const isCourseAlreadyInStudent = studentCourses.some(
      (c: any) => c.id === courseId
    );

    if (!isCourseAlreadyInStudent) {
      studentCourses.push({
        id: courseId,
        name: courseData.COURSE_NAME,
      });

      await studentRef.update({ COURSES: studentCourses });
    }
  }

  addNewCourses(id: any) {
    return this.afs.collection('courses/').doc(id).set({});
  }

  getSingleCourse(courseId: string): Observable<any> {
    return this.afs
      .collection('courses')
      .doc(courseId)
      .valueChanges({ idField: 'id' });
  }

  updateCourses(course: any) {
    return this.afs.collection('courses').doc(course.id).update(course);
  }

  async deleteCourseEverywhere(courseId: string): Promise<void> {
    console.log('Starting deleteCourseEverywhere for courseId:', courseId);

    const batch = this.afs.firestore.batch();

    const teacherRef = this.afs.collection('users').doc(courseId);
    console.log('Teacher ref:', teacherRef.ref.path);
    const teacherSnap = await teacherRef.get().toPromise();
    if (teacherSnap && teacherSnap.exists) {
      const teacherData = teacherSnap.data() as any;
      const teacherCourses = teacherData.COURSES || [];
      const filteredTeacherCourses = teacherCourses.filter((c: any) => c.id !== courseId);
      if (filteredTeacherCourses.length !== teacherCourses.length) {
        batch.update(teacherRef.ref, {
          COURSES: filteredTeacherCourses,
        });
      }
    }

    const quizzesRef = this.afs.collection('quizzes', (ref) =>
      ref.where('courseId', '==', courseId)
    );
    const quizzesSnap = await firstValueFrom(quizzesRef.get());
    console.log('Quizzes found:', quizzesSnap.size);
    quizzesSnap.forEach((doc) => {
      console.log('Deleting quiz:', doc.id);
      batch.delete(doc.ref);
    });

    const gradesRef = this.afs.collection('grades', (ref) =>
      ref.where('courseId', '==', courseId)
    );
    const gradesSnap = await firstValueFrom(gradesRef.get());
    console.log('Grades found:', gradesSnap.size);
    gradesSnap.forEach((doc) => {
      console.log('Deleting grade:', doc.id);
      batch.delete(doc.ref);
    });

    const studentsRef = this.afs.collection('users');
    const studentsSnap = await firstValueFrom(studentsRef.get());
    console.log('Users found:', studentsSnap.size);
    studentsSnap.forEach((doc) => {
      const studentCourses = (doc.data() as any).COURSES || [];
      const filteredCourses = studentCourses.filter((c: any) => c.id !== courseId);
      if (filteredCourses.length !== studentCourses.length) {
        console.log(`Updating user ${doc.id}: removing course ${courseId}`);
        batch.update(doc.ref, {
          COURSES: filteredCourses,
        });
      }
    });

    const courseRef = this.afs.collection('courses').doc(courseId);
    batch.delete(courseRef.ref);

    await batch.commit();
    console.log('Batch commit complete for deleteCourseEverywhere');
  }
}
