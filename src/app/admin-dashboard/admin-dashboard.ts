import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../layout/sidebar/sidebar';
import { User } from '../services/user';
import { Course } from '../services/course';
import { Calendar } from '../services/calendar';
import { BatchService } from '../services/batch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, Sidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  adminName = localStorage.getItem('name');
  role = localStorage.getItem('role');

  totalUsers = 0;
  totalManagers = 0;
  totalEmployees = 0;
  activeUsers = 0;
  inactiveUsers = 0;

  totalCourses = 0;
  totalSchedules = 0;
  totalBatches = 0;
  openBatches = 0;

  upcomingSchedules: any[] = [];
  recentBatches: any[] = [];

  constructor(
    private userService: User,
    private courseService: Course,
    private calendarService: Calendar,
    private batchService: BatchService
  ) {}

  ngOnInit() {
    this.loadUserStats();
    this.loadCourseStats();
    this.loadScheduleStats();
    this.loadBatchStats();
  }

  loadUserStats() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        const users = res.users || [];

        this.totalUsers = users.length;

        this.activeUsers = users.filter(
          (user: any) => user.isActive === true
        ).length;

        this.inactiveUsers = users.filter(
          (user: any) => user.isActive === false
        ).length;

        this.totalManagers = users.filter(
          (user: any) => user.role === 'manager'
        ).length;

        this.totalEmployees = users.filter(
          (user: any) => user.role === 'employee'
        ).length;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  loadCourseStats() {
    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        const courses = res.courses || res.data || [];
        this.totalCourses = courses.length;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  loadScheduleStats() {
  this.calendarService.getCalendars().subscribe({
    next: (res: any) => {
      const calendars = res.calendars || res.data || [];

      this.totalSchedules = calendars.length;

      this.upcomingSchedules = calendars
        .filter((calendar: any) => calendar.status === 'upcoming')
        .sort(
          (a: any, b: any) =>
            new Date(a.startDate).getTime() -
            new Date(b.startDate).getTime()
        )
        .slice(0, 5);
    },
    error: (err: any) => {
      console.log(err);
    },
  });
}

  loadBatchStats() {
  this.batchService.getBatches().subscribe({
    next: (res: any) => {
      const batches: any[] = Array.isArray(res)
        ? res
        : res.batches || res.data || [];

      this.totalBatches = batches.length;

      this.openBatches = batches.filter(
        (batch: any) => batch.status === 'open'
      ).length;

      this.recentBatches = batches.slice(0, 5);
    },
    error: (err: any) => {
      console.log(err);
    },
  });
}
}