import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeSlot } from '../interfaces/data';
import 'firebase/compat/firestore';

@Injectable({ providedIn: 'root' })
export class TimeTableService {
  private collection = this.firestore.collection<TimeSlot>('timetables');

  constructor(private firestore: AngularFirestore) {}

  getTimeSlots(): Observable<TimeSlot[]> {
    return this.collection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TimeSlot;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  addTimeSlot(slot: TimeSlot): Promise<void> {
    const id = this.firestore.createId();

    return this.firestore
      .collection<TimeSlot>('timetables')
      .doc(id)
      .set({ ...slot, id });
  }

  deleteTimeSlot(id: string) {
    return this.firestore.collection('timetables').doc(id).delete();
  }

  getStudentById(id: string): Observable<any> {
    return this.firestore.collection('users').doc(id).valueChanges();
  }

  updateTimeSlot(slot: TimeSlot): Promise<void> {
    return this.firestore.collection('timetables').doc(slot.id).update(slot);
  }

  showSingleTimeTable(id: string) {
    return this.firestore.collection('timetables').doc(id).valueChanges();
  }
}
