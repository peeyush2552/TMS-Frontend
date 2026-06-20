import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BatchService } from '../services/batch';
import { Course } from '../services/course';
import { Calendar } from '../services/calendar';
import { Sidebar } from '../layout/sidebar/sidebar';
@Component({
  selector: 'app-batch-management',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './batch-management.html',
  styleUrl: './batch-management.css',
})
export class BatchManagement implements OnInit {
  batches: any[] = [];
  courses: any[] = [];
  calendars: any[] = [];
  filteredCalendars: any[] = [];
  selectedCalendar: any = null;
  searchText = '';
  statusFilter = '';

  batchData = {
    batchName: '',
    course: '',
    calendar: '',
    trainerName: '',
    capacity: '',
    status: 'open',
  };

  editMode = false;
  editBatchId = '';

  successMessage = '';
  errorMessage = '';

  constructor(
    private batchService: BatchService,
    private courseService: Course,
    private calendarService: Calendar
  ) {}

  ngOnInit(): void {
    this.loadBatches();
    this.loadCourses();
    this.loadCalendars();
  }

  loadBatches() {
  this.batchService.getBatches().subscribe({
    next: (res: any) => {
      this.batches = Array.isArray(res) ? res : res.batches || res.data || [];
    },
    error: () => {
      this.errorMessage = 'Failed to load batches';
    },
  });
}

  loadCourses() {
  this.courseService.getCourses().subscribe({
    next: (res: any) => {
      console.log('Courses response:', res);
      this.courses = res.courses || res.data || [];
    },
    error: (err) => {
      console.log('Course error:', err);
      this.errorMessage = 'Failed to load courses';
    },
  });
}

onCourseChange() {
  this.batchData.calendar = '';
  this.selectedCalendar = null;

  this.filteredCalendars = this.calendars.filter((calendar: any) => {
    const calendarCourseId = calendar.course?._id || calendar.course;
    return calendarCourseId === this.batchData.course;
  });
}

loadCalendars() {
  this.calendarService.getCalendars().subscribe({
    next: (res: any) => {
      console.log('Calendars response:', res);
      this.calendars = res.calendars || res.data || [];
      this.filteredCalendars = this.calendars;
    },
    error: (err) => {
      console.log('Calendar error:', err);
      this.errorMessage = 'Failed to load calendars';
    },
  });
}

  saveBatch() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.editMode) {
      this.batchService.updateBatch(this.editBatchId, this.batchData).subscribe({
        next: () => {
          this.successMessage = 'Batch updated successfully';
          this.resetForm();
          this.loadBatches();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update batch';
        },
      });
    } else {
      this.batchService.createBatch(this.batchData).subscribe({
        next: () => {
          this.successMessage = 'Batch created successfully';
          this.resetForm();
          this.loadBatches();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create batch';
        },
      });
    }
  }

  editBatch(batch: any) {
  this.editMode = true;
  this.editBatchId = batch._id;

  this.batchData = {
    batchName: batch.batchName,
    course: batch.course?._id || batch.course,
    calendar: batch.calendar?._id || batch.calendar,
    trainerName: batch.trainerName,
    capacity: batch.capacity,
    status: batch.status,
  };

  this.onCourseChange();
  this.onScheduleChange();
}

  cancelBatch(id: string) {
    if (confirm('Are you sure you want to cancel this batch?')) {
      this.batchService.cancelBatch(id).subscribe({
        next: () => {
          this.successMessage = 'Batch cancelled successfully';
          this.loadBatches();
        },
        error: () => {
          this.errorMessage = 'Failed to cancel batch';
        },
      });
    }
  }

  onScheduleChange() {
  this.selectedCalendar = this.calendars.find((calendar: any) => {
    return calendar._id === this.batchData.calendar;
  });
}

get filteredBatches() {
  return this.batches.filter((batch: any) => {
    const searchMatch =
      !this.searchText ||
      batch.batchName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      batch.course?.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      batch.trainerName?.toLowerCase().includes(this.searchText.toLowerCase());

    const statusMatch =
      !this.statusFilter || batch.status === this.statusFilter;

    return searchMatch && statusMatch;
  });
}

  resetForm() {
  this.batchData = {
    batchName: '',
    course: '',
    calendar: '',
    trainerName: '',
    capacity: '',
    status: 'open',
  };

  this.filteredCalendars = this.calendars;
  this.selectedCalendar = null;

  this.editMode = false;
  this.editBatchId = '';
}
}