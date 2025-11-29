import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInternalsComponent } from './all-internals.component';

describe('AllInternalsComponent', () => {
  let component: AllInternalsComponent;
  let fixture: ComponentFixture<AllInternalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInternalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInternalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
