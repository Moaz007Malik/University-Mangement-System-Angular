import { Component, OnInit } from '@angular/core';
import { TimeTableService } from '../../services/timetable.service'; // you need this
import { AuthService } from '../../auth/auth.service'; // assuming logged-in teacher
import { TimeSlot } from '../../interfaces/data';

@Component({
  selector: 'app-teacher-time-table',
  templateUrl: './teacher-time-table.component.html',
  styleUrls: ['./teacher-time-table.component.css'],
})
export class TeacherTimeTableComponent implements OnInit {
  teacherId: string = '';
  timeSlots: TimeSlot[] = [];
  loading = true;

  constructor(
    private timeTableService: TimeTableService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get logged-in teacher ID
    const teacher = this.authService.getCurrentUser();
    if (teacher) {
      this.teacherId = teacher.id;

      // Fetch all time slots where teacher is assigned
      this.timeTableService.getTimeSlots().subscribe((slots) => {
        this.timeTableService.getTimeSlots().subscribe((slots) => {
          this.timeSlots = slots.filter(
            (slot) => slot.teacherId === this.teacherId
          );
          this.loading = false;
        });
      });
    }
  }
}
