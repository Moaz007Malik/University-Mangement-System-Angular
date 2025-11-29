import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTimeTableComponent } from './teacher-time-table.component';

describe('TeacherTimeTableComponent', () => {
  let component: TeacherTimeTableComponent;
  let fixture: ComponentFixture<TeacherTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherTimeTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
