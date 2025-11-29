// services/grades.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GradeEntry } from '../interfaces/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GradesService {
  private collection = this.firestore.collection<GradeEntry>('grades');

  constructor(private firestore: AngularFirestore) {}

  getGrades(): Observable<GradeEntry[]> {
    return this.collection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as GradeEntry;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getGradesForStudent(studentId: string): Observable<GradeEntry[]> {
    return this.firestore
      .collection<GradeEntry>('grades', (ref) =>
        ref.where('studentId', '==', studentId)
      )
      .valueChanges({ idField: 'id' });
  }

  addGrade(entry: GradeEntry): Promise<void> {
    const id = this.firestore.createId();
    return this.collection.doc(id).set({ ...entry, id });
  }

  updateGrade(entry: GradeEntry): Promise<void> {
    return this.collection.doc(entry.id).update(entry);
  }

  deleteGrade(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}
