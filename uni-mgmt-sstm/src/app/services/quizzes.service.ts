// services/quizzes.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Quiz } from '../interfaces/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QuizzesService {
  constructor(private firestore: AngularFirestore) {}

  getQuizzes(): Observable<Quiz[]> {
    return this.firestore
      .collection<Quiz>('quizzes')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => ({
            id: a.payload.doc.id,
            ...a.payload.doc.data(),
          }))
        )
      );
  }

  addQuiz(quiz: Quiz) {
    const id = this.firestore.createId();
    return this.firestore
      .collection('quizzes')
      .doc(id)
      .set({ ...quiz, id });
  }

  updateQuiz(quiz: Quiz) {
    return this.firestore.collection('quizzes').doc(quiz.id).update(quiz);
  }

  deleteQuiz(id: string) {
    return this.firestore.collection('quizzes').doc(id).delete();
  }
}
