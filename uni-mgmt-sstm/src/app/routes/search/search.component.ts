import { Component } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { User } from '../../interfaces/data';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  users: User[] = [];
  searchText: string = '';
  selectedRole: string = 'student';

  constructor(private userService: StudentsService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((actions) => {
      this.users = actions.map((action) => {
        const data = action.payload.doc.data() as User;
        // If needed, add ID like: data.id = action.payload.doc.id;
        return { ...data, id: action.payload.doc.id };
      });
    });
  }

  formatUserId(id: string | number): string {
    const str = id.toString();
    return str.length > 2 ? str.slice(0, 2) + '-' + str.slice(2) : str;
  }

  get filteredUsers(): User[] {
    const roleUsers = this.users.filter((u) => u.USER_TYPE === this.selectedRole);
    return this.searchText.trim()
      ? roleUsers.filter(
          (u) =>
            u.USER_NAME.toLowerCase().includes(this.searchText.toLowerCase()) ||
            u.USER_ID.toString().includes(this.searchText)
        )
      : roleUsers.slice(0, 3);
  }
}
