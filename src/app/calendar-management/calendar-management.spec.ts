import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CalendarManagement } from './calendar-management';

describe('CalendarManagement', () => {
  let component: CalendarManagement;
  let fixture: ComponentFixture<CalendarManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarManagement],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
