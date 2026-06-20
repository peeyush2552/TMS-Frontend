import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule, CalendarEvent, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Course } from '../services/course';
import { Calendar } from '../services/calendar';

@Component({
  selector: 'app-calendar-management',
  imports: [FormsModule, Sidebar, CalendarModule, CommonModule],
  templateUrl: './calendar-management.html',
  styleUrl: './calendar-management.css',
})
export class CalendarManagement implements OnInit {
  courses: any[] = [];
  schedules: any[] = [];

  calendarEvents: CalendarEvent[] = [];
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = false;
  refresh = new Subject<void>();
  selectedEvent: any = null;

  course = '';
  startDate = '';
  endDate = '';
  sessionTime = '';
  mode = 'online';
  location = '';
  meetingLink = '';
  status = 'upcoming';

  successMessage = '';
  errorMessage = '';

  isEditMode = false;
  selectedCalendarId = '';

  searchText = '';
  selectedStatus = 'all';

  // Get today's date in YYYY-MM-DD format for min date attribute
  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Get minimum end date (should be >= start date)
  get minEndDate(): string {
    if (this.startDate) {
      return this.startDate;
    }
    return this.minDate;
  }

  constructor(
  private courseService: Course,
  private calendarService: Calendar
) {}

  ngOnInit() {
    this.loadCourses();
    this.loadCalendars();
  }

  loadCourses() {
  this.courseService.getCourses().subscribe({
    next: (res: any) => {
      this.courses = res.courses;
    },
    error: (err) => {
      console.log(err);
    },
  });
}

loadCalendars() {
  this.calendarService.getCalendars().subscribe({
    next: (res: any) => {
      this.schedules = res.calendars;

      this.calendarEvents = this.schedules.map((schedule: any) => ({
        start: new Date(schedule.startDate),
        end: new Date(schedule.endDate),
        title: `${schedule.course?.title}`,
        color: this.getEventColor(schedule.status),
        meta: {
          courseId: schedule.course?._id,
          sessionTime: schedule.sessionTime,
          mode: schedule.mode,
          location: schedule.location,
          meetingLink: schedule.meetingLink,
          status: schedule.status,
          scheduleId: schedule._id
        }
      }));

      this.refresh.next();
    },
    error: (err) => {
      console.log(err);
    },
  });
}

getEventColor(status: string): any {
  const colors = {
    upcoming: { primary: '#1e40af', secondary: '#dbeafe' },
    ongoing: { primary: '#92400e', secondary: '#fef3c7' },
    completed: { primary: '#16a34a', secondary: '#dcfce7' },
    cancelled: { primary: '#dc2626', secondary: '#fee2e2' }
  };
  return colors[status as keyof typeof colors] || colors.upcoming;
}

dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if (events.length > 0) {
    this.activeDayIsOpen = !this.activeDayIsOpen;
  }
  this.viewDate = date;
}

handleEvent(event: CalendarEvent): void {
  this.selectedEvent = event;
}

closeEventDetails(): void {
  this.selectedEvent = null;
}

previousMonth(): void {
  const currentMonth = this.viewDate.getMonth();
  const currentYear = this.viewDate.getFullYear();
  this.viewDate = new Date(currentYear, currentMonth - 1, 1);
}

nextMonth(): void {
  const currentMonth = this.viewDate.getMonth();
  const currentYear = this.viewDate.getFullYear();
  this.viewDate = new Date(currentYear, currentMonth + 1, 1);
}

createCalendar() {
  // Validation
  if (!this.course) {
    this.errorMessage = 'Please select a course';
    this.successMessage = '';
    return;
  }

  if (!this.startDate || !this.endDate) {
    this.errorMessage = 'Start date and end date are required';
    this.successMessage = '';
    return;
  }

  // Validate start date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedStartDate = new Date(this.startDate);
  selectedStartDate.setHours(0, 0, 0, 0);

  if (selectedStartDate < today && !this.isEditMode) {
    this.errorMessage = 'Start date cannot be in the past';
    this.successMessage = '';
    return;
  }

  // Validate end date is after start date
  if (new Date(this.startDate) > new Date(this.endDate)) {
    this.errorMessage = 'End date must be after start date';
    this.successMessage = '';
    return;
  }

  if (!this.sessionTime.trim()) {
    this.errorMessage = 'Session time is required';
    this.successMessage = '';
    return;
  }

  const calendarData = {
    course: this.course,
    startDate: this.startDate,
    endDate: this.endDate,
    sessionTime: this.sessionTime,
    mode: this.mode,
    location: this.location,
    meetingLink: this.meetingLink,
    status: this.status,
  };

  if (this.isEditMode) {
    this.calendarService.updateCalendar(this.selectedCalendarId, calendarData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.resetForm();
        this.loadCalendars();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  } else {
    this.calendarService.createCalendar(calendarData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.resetForm();
        this.loadCalendars();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  }
}

editCalendar(schedule: any) {
  this.isEditMode = true;
  this.selectedCalendarId = schedule._id;

  this.course = schedule.course?._id || '';
  this.startDate = schedule.startDate?.split('T')[0] || '';
  this.endDate = schedule.endDate?.split('T')[0] || '';
  this.sessionTime = schedule.sessionTime;
  this.mode = schedule.mode;
  this.location = schedule.location || '';
  this.meetingLink = schedule.meetingLink || '';
  this.status = schedule.status;

  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

deleteCalendar(schedule: any) {
  if (
    confirm(
      schedule.status === 'cancelled'
        ? `Reactivate ${schedule.course?.title}?`
        : `Cancel ${schedule.course?.title}?`
    )
  ) {
    this.calendarService.deleteCalendar(schedule._id).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.loadCalendars();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  }
}

cancelEdit() {
  this.resetForm();
}

get filteredSchedules() {
  return this.schedules.filter((schedule) => {
    const search = this.searchText.toLowerCase();

    const matchesSearch =
      schedule.course?.title?.toLowerCase().includes(search) ||
      schedule.course?.code?.toLowerCase().includes(search) ||
      schedule.trainerName?.toLowerCase().includes(search);

    const matchesStatus =
      this.selectedStatus === 'all' ||
      schedule.status === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

resetForm() {
  this.course = '';
  this.startDate = '';
  this.endDate = '';
  this.sessionTime = '';
  this.mode = 'online';
  this.location = '';
  this.meetingLink = '';
  this.status = 'upcoming';
  this.isEditMode = false;
  this.selectedCalendarId = '';
}
}