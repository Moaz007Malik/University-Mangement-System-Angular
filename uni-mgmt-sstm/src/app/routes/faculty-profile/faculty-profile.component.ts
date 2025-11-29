import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/data';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
})
export class FacultyProfileComponent implements OnInit {
  faculty!: User & { id?: string };
  showEditForm = false;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.afs
        .collection('users')
        .doc(id)
        .valueChanges({ idField: 'id' })
        .subscribe((data: any) => {
          this.faculty = data;
        });
    }
  }

  updateFaculty(data: User) {
    if (!this.faculty.id) return;
    this.afs
      .collection('users')
      .doc(this.faculty.id)
      .update(data)
      .then(() => {
        this.showEditForm = false;
      });
  }

  toggleEdit() {
    this.showEditForm = !this.showEditForm;
  }
}
