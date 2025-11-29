import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { User } from '../../../interfaces/data';
import { StudentsService } from '../../../services/students.service';

@Component({
  selector: 'app-add-faculty',
  templateUrl: './add-faculty.component.html',
})
export class AddFacultyComponent {
  users: User[] = [];
  isAuthToReg: boolean = true;

  constructor(
    private studentService: StudentsService,
    private location: Location
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  addUser(formData: any) {
    const user: User = {
      ...formData,
      USER_TYPE: 'faculty',
      IS_AUTH_TO_REG: this.isAuthToReg,
    };

    this.studentService.addUsers(user).then(() => {
      this.studentService.getUsers().subscribe((students) => {
        this.users = students.map((action: any) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data } as User;
        });
        this.goBack(); // Navigate back after addition
      });
    });
  }
}
