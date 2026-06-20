import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingHistory } from './training-history';

describe('TrainingHistory', () => {
  let component: TrainingHistory;
  let fixture: ComponentFixture<TrainingHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
