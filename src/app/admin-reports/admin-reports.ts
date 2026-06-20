import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../layout/sidebar/sidebar';
import { User } from '../services/user';
import { Course } from '../services/course';
import { BatchService } from '../services/batch';
import { Enrollment } from '../services/enrollment';

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports implements OnInit {
  activeTab = 'user';

  // User Report Data
  users: any[] = [];
  filteredUsers: any[] = [];
  userSearchTerm = '';
  userRoleFilter = 'all';
  userStatusFilter = 'all';

  // Course Report Data
  courses: any[] = [];
  filteredCourses: any[] = [];
  courseSearchTerm = '';
  courseCategoryFilter = 'all';
  courseStatusFilter = 'all';

  // Batch Report Data
  batches: any[] = [];
  filteredBatches: any[] = [];
  batchSearchTerm = '';
  batchStatusFilter = 'all';

  // Enrollment Report Data
  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  enrollmentSearchTerm = '';
  enrollmentStatusFilter = 'all';

  constructor(
    private userService: User,
    private courseService: Course,
    private batchService: BatchService,
    private enrollmentService: Enrollment
  ) {}

  ngOnInit() {
    this.loadUserReport();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    
    if (tab === 'user' && this.users.length === 0) {
      this.loadUserReport();
    } else if (tab === 'course' && this.courses.length === 0) {
      this.loadCourseReport();
    } else if (tab === 'batch' && this.batches.length === 0) {
      this.loadBatchReport();
    } else if (tab === 'enrollment' && this.enrollments.length === 0) {
      this.loadEnrollmentReport();
    }
  }

  // User Report Methods
  loadUserReport() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res || [];
        this.applyUserFilters();
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
      },
    });
  }

  applyUserFilters() {
    let filtered = [...this.users];

    if (this.userRoleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === this.userRoleFilter);
    }

    if (this.userStatusFilter === 'active') {
      filtered = filtered.filter((user) => user.isActive === true);
    } else if (this.userStatusFilter === 'inactive') {
      filtered = filtered.filter((user) => user.isActive === false);
    }

    if (this.userSearchTerm.trim()) {
      const term = this.userSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.employeeId?.toLowerCase().includes(term) ||
          user.department?.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  // Course Report Methods
  loadCourseReport() {
    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res || [];
        this.applyCourseFilters();
      },
      error: (err: any) => {
        console.error('Error loading courses:', err);
      },
    });
  }

  applyCourseFilters() {
    let filtered = [...this.courses];

    if (this.courseCategoryFilter !== 'all') {
      filtered = filtered.filter(
        (course) => course.category === this.courseCategoryFilter
      );
    }

    if (this.courseStatusFilter === 'active') {
      filtered = filtered.filter((course) => course.isActive === true);
    } else if (this.courseStatusFilter === 'inactive') {
      filtered = filtered.filter((course) => course.isActive === false);
    }

    if (this.courseSearchTerm.trim()) {
      const term = this.courseSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.code?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term)
      );
    }

    this.filteredCourses = filtered;
  }

  // Batch Report Methods
  loadBatchReport() {
    this.batchService.getBatches().subscribe({
      next: (res: any) => {
        this.batches = res || [];
        this.applyBatchFilters();
      },
      error: (err: any) => {
        console.error('Error loading batches:', err);
      },
    });
  }

  applyBatchFilters() {
    let filtered = [...this.batches];

    if (this.batchStatusFilter !== 'all') {
      filtered = filtered.filter(
        (batch) => batch.status === this.batchStatusFilter
      );
    }

    if (this.batchSearchTerm.trim()) {
      const term = this.batchSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (batch) =>
          batch.batchName?.toLowerCase().includes(term) ||
          batch.trainerName?.toLowerCase().includes(term) ||
          batch.course?.title?.toLowerCase().includes(term)
      );
    }

    this.filteredBatches = filtered;
  }

  // Enrollment Report Methods
  loadEnrollmentReport() {
    // We need to create an admin endpoint to get all enrollments
    // For now, we'll handle this gracefully
    console.log('Enrollment report loading - requires backend endpoint');
    this.filteredEnrollments = [];
  }

  applyEnrollmentFilters() {
    let filtered = [...this.enrollments];

    if (this.enrollmentStatusFilter !== 'all') {
      filtered = filtered.filter(
        (enrollment) => enrollment.status === this.enrollmentStatusFilter
      );
    }

    if (this.enrollmentSearchTerm.trim()) {
      const term = this.enrollmentSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.employee?.name?.toLowerCase().includes(term) ||
          enrollment.batch?.batchName?.toLowerCase().includes(term)
      );
    }

    this.filteredEnrollments = filtered;
  }

  // Export Methods
  exportUserReport() {
    const csv = this.generateUserCSV();
    this.downloadCSV(csv, 'user-report.csv');
  }

  exportCourseReport() {
    const csv = this.generateCourseCSV();
    this.downloadCSV(csv, 'course-report.csv');
  }

  exportBatchReport() {
    const csv = this.generateBatchCSV();
    this.downloadCSV(csv, 'batch-report.csv');
  }

  private generateUserCSV(): string {
    const headers = ['Name', 'Email', 'Role', 'Employee ID', 'Department', 'Manager', 'Status'];
    const rows = this.filteredUsers.map((user) => [
      user.name || '',
      user.email || '',
      user.role || '',
      user.employeeId || '',
      user.department || '',
      user.assignedManager?.name || 'N/A',
      user.isActive ? 'Active' : 'Inactive',
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  private generateCourseCSV(): string {
    const headers = ['Title', 'Code', 'Category', 'Duration (Hours)', 'Status'];
    const rows = this.filteredCourses.map((course) => [
      course.title || '',
      course.code || '',
      course.category || '',
      course.durationHours?.toString() || '',
      course.isActive ? 'Active' : 'Inactive',
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  private generateBatchCSV(): string {
    const headers = [
      'Batch Name',
      'Course',
      'Trainer',
      'Start Date',
      'End Date',
      'Capacity',
      'Enrolled',
      'Status',
    ];
    const rows = this.filteredBatches.map((batch) => [
      batch.batchName || '',
      batch.course?.title || '',
      batch.trainerName || '',
      batch.calendar?.startDate || '',
      batch.calendar?.endDate || '',
      batch.capacity?.toString() || '',
      batch.enrolledCount?.toString() || '',
      batch.status || '',
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  private arrayToCSV(data: string[][]): string {
    return data.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  private downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Statistics
  getTotalActiveUsers(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  getTotalInactiveUsers(): number {
    return this.users.filter((u) => u.isActive === false).length;
  }

  getTotalActiveCourses(): number {
    return this.courses.filter((c) => c.isActive).length;
  }

  getTotalInactiveCourses(): number {
    return this.courses.filter((c) => c.isActive === false).length;
  }

  getOpenBatches(): number {
    return this.batches.filter((b) => b.status === 'open').length;
  }

  getClosedBatches(): number {
    return this.batches.filter((b) => b.status === 'closed').length;
  }

  getCancelledBatches(): number {
    return this.batches.filter((b) => b.status === 'cancelled').length;
  }
}
