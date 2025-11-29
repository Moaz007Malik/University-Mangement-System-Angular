import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzesAssignmentsComponent } from './quizzes-assignments.component';

describe('QuizzesAssignmentsComponent', () => {
  let component: QuizzesAssignmentsComponent;
  let fixture: ComponentFixture<QuizzesAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizzesAssignmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzesAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
