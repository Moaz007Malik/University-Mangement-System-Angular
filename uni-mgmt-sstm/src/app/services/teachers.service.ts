import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Teacher } from '../interfaces/data';

@Injectable({ providedIn: 'root' })
export class TeachersService {
  constructor(private firestore: AngularFirestore) {}

  getTeachers(): Observable<Teacher[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('USER_TYPE', '==', 'teacher'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Teacher;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getTeacherById(id: string): Observable<Teacher | null> {
    return this.firestore
      .collection('users')
      .doc<Teacher>(id)
      .valueChanges()
      .pipe(
        map((teacher) => {
          if (teacher) {
            return { id, ...teacher };
          }
          return null;
        })
      );
  }
}
