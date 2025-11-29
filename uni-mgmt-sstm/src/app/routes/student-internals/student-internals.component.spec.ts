import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInternalsComponent } from './student-internals.component';

describe('StudentInternalsComponent', () => {
  let component: StudentInternalsComponent;
  let fixture: ComponentFixture<StudentInternalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentInternalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInternalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
