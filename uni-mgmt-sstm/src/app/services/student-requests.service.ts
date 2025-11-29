import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { CourseRequest } from '../interfaces/data';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class StudentRequestsService {
  private collectionName = 'requests';

  constructor(private firestore: AngularFirestore) {}

  createRequest(request: CourseRequest): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore
      .collection<CourseRequest>(this.collectionName)
      .doc(id)
      .set({ ...request, id, status: 'pending', timestamp: new Date() });
  }

  getPendingRequests(): Observable<CourseRequest[]> {
    return this.firestore
      .collection<CourseRequest>(this.collectionName, (ref) =>
        ref.where('status', '==', 'pending')
      )
      .valueChanges({ idField: 'id' });
  }

  getRequestsByStudent(studentId: string): Observable<CourseRequest[]> {
    return this.firestore
      .collection<CourseRequest>(this.collectionName, (ref) =>
        ref.where('studentId', '==', studentId)
      )
      .valueChanges({ idField: 'id' });
  }

  getAllRequests(): Observable<CourseRequest[]> {
    return this.firestore
      .collection<CourseRequest>('requests')
      .valueChanges({ idField: 'id' });
  }

  async approveRequest(request: CourseRequest): Promise<void> {
    const requestRef = this.firestore
      .collection(this.collectionName)
      .doc(request.id);
    const userRef = this.firestore.collection('users').doc(request.studentId);
    const courseRef = this.firestore
      .collection('courses')
      .doc(request.courseId);

    try {
      await requestRef.update({ status: 'approved' });

      const userSnap = await firstValueFrom(userRef.get());
      const userData = userSnap.data() as any;
      const currentCourses = Array.isArray(userData?.COURSES)
        ? userData.COURSES
        : [];

      let updatedStudentCourses = [...currentCourses];

      if (request.type === 'enroll') {
        updatedStudentCourses.push({
          id: request.courseId,
          name: request.courseName,
        });
      } else if (request.type === 'drop') {
        updatedStudentCourses = updatedStudentCourses.filter(
          (c) => c.id !== request.courseId
        );
      }

      await userRef.update({ COURSES: updatedStudentCourses });

      const courseSnap = await firstValueFrom(courseRef.get());
      const courseData = courseSnap.data() as any;
      let courseStudents = Array.isArray(courseData?.COURSE_STUDENTS)
        ? courseData.COURSE_STUDENTS
        : [];

      if (request.type === 'enroll') {
        const alreadyExists = courseStudents.some(
          (s: { studentId: string }) => s.studentId === request.studentId
        );
        if (!alreadyExists) {
          courseStudents.push({
            studentId: request.studentId,
            studentName: request.studentName,
          });
        }
      } else if (request.type === 'drop') {
        courseStudents = courseStudents.filter(
          (s: { studentId: string }) => s.studentId !== request.studentId
        );
      }

      await courseRef.update({ COURSE_STUDENTS: courseStudents });

      // ✅ Delete the request after successful processing
      if (request.id) {
        await this.deleteRequest(request.id);
      } else {
        throw new Error('Request id is undefined');
      }

      console.log('✅ User COURSES and COURSE_STUDENTS updated successfully');
    } catch (err) {
      console.error('❌ Error approving request:', err);
    }
  }

  async rejectRequest(request: CourseRequest): Promise<void> {
    try {
      await this.firestore
        .collection(this.collectionName)
        .doc(request.id)
        .update({ status: 'rejected' });

      // ✅ Delete the request after rejection
      if (request.id) {
        await this.deleteRequest(request.id);
      } else {
        throw new Error('Request id is undefined');
      }
    } catch (err) {
      console.error('❌ Error rejecting request:', err);
    }
  }

  deleteRequest(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
