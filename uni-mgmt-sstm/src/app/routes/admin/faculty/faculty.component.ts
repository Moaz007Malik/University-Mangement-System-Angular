import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/data';
import { StudentsService } from '../../../services/students.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  faculty: User[] = [];
  selectedType: 'faculty' = 'faculty';

  constructor(private studentService: StudentsService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.studentService.getUsers().subscribe((res: any) => {
      this.faculty = res
        .map((e: any) => {
          const data = e.payload.doc.data() as User;
          data.id = e.payload.doc.id;
          return data;
        })
        .filter((user: User) => user.USER_TYPE === this.selectedType);
    });
  }

  deleteUser(user: User) {
    this.studentService.deleteUsers(user.id).then(() => {
      this.getUser();
    });
  }

  trackById(index: number, item: User) {
    return item.id;
  }
}
