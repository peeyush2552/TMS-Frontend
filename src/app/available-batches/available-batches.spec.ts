import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBatches } from './available-batches';

describe('AvailableBatches', () => {
  let component: AvailableBatches;
  let fixture: ComponentFixture<AvailableBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableBatches],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableBatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
