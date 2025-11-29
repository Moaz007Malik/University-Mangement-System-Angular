import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllgradesComponent } from './allgrades.component';

describe('AllgradesComponent', () => {
  let component: AllgradesComponent;
  let fixture: ComponentFixture<AllgradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllgradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
