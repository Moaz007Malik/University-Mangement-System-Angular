import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private afs: AngularFirestore) {}

  getUsers() {
    return this.afs.collection('users').snapshotChanges();
  }

  addUsers(user: any) {
    return this.afs.collection('users').add(user);
  }

  deleteUsers(id: string) {
    return this.afs.doc(`users/${id}`).delete();
  }

  getSingleUser(id: string) {
    return this.afs
      .doc(`users/${id}`)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data() as any;
          const userId = action.payload.id;
          return { ...data, id: userId };
        })
      );
  }

  getGradesByStudent(studentId: string) {
    return this.afs
      .collection('grades', (ref) => ref.where('studentId', '==', studentId))
      .valueChanges();
  }

  updateUsers(user: any) {
    return this.afs.doc(`users/${user.id}`).update(user);
  }
}
