import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerSidebar } from '../layout/manager-sidebar/manager-sidebar';
import { User } from '../services/user';
import { Enrollment } from '../services/enrollment';

@Component({
  selector: 'app-manager-reports',
  imports: [CommonModule, FormsModule, ManagerSidebar],
  templateUrl: './manager-reports.html',
  styleUrl: './manager-reports.css',
})
export class ManagerReports implements OnInit {
  managerId = localStorage.getItem('userId');
  managerName = localStorage.getItem('name');

  // Team Members Data
  teamMembers: any[] = [];
  filteredTeamMembers: any[] = [];
  teamSearchTerm = '';
  teamStatusFilter = 'all';

  // Enrollments Data
  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  enrollmentSearchTerm = '';
  enrollmentStatusFilter = 'all';

  activeTab = 'team';

  constructor(
    private userService: User,
    private enrollmentService: Enrollment
  ) {}

  ngOnInit() {
    this.loadTeamReport();
  }

  switchTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'team' && this.teamMembers.length === 0) {
      this.loadTeamReport();
    } else if (tab === 'enrollment' && this.enrollments.length === 0) {
      this.loadEnrollmentReport();
    }
  }

  // Team Report
  loadTeamReport() {
    if (!this.managerId) {
      return;
    }

    this.userService.getEmployeesByManager(this.managerId).subscribe({
      next: (res: any) => {
        this.teamMembers = res.employees || [];
        this.applyTeamFilters();
      },
      error: (err: any) => {
        console.error('Error loading team:', err);
      },
    });
  }

  applyTeamFilters() {
    let filtered = [...this.teamMembers];

    if (this.teamStatusFilter === 'active') {
      filtered = filtered.filter((member) => member.isActive === true);
    } else if (this.teamStatusFilter === 'inactive') {
      filtered = filtered.filter((member) => member.isActive === false);
    }

    if (this.teamSearchTerm.trim()) {
      const term = this.teamSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(term) ||
          member.email?.toLowerCase().includes(term) ||
          member.employeeId?.toLowerCase().includes(term) ||
          member.department?.toLowerCase().includes(term)
      );
    }

    this.filteredTeamMembers = filtered;
  }

  // Enrollment Report
  loadEnrollmentReport() {
    if (!this.managerId) {
      return;
    }

    this.enrollmentService.getManagerApprovals(this.managerId).subscribe({
      next: (res: any) => {
        this.enrollments = res.enrollments || [];
        this.applyEnrollmentFilters();
      },
      error: (err: any) => {
        console.error('Error loading enrollments:', err);
      },
    });
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
          enrollment.batch?.batchName?.toLowerCase().includes(term) ||
          enrollment.batch?.course?.title?.toLowerCase().includes(term)
      );
    }

    this.filteredEnrollments = filtered;
  }

  // Export Methods
  exportTeamReport() {
    const csv = this.generateTeamCSV();
    this.downloadCSV(csv, 'team-report.csv');
  }

  exportEnrollmentReport() {
    const csv = this.generateEnrollmentCSV();
    this.downloadCSV(csv, 'enrollment-report.csv');
  }

  private generateTeamCSV(): string {
    const headers = ['Name', 'Email', 'Employee ID', 'Department', 'Status'];
    const rows = this.filteredTeamMembers.map((member) => [
      member.name || '',
      member.email || '',
      member.employeeId || '',
      member.department || '',
      member.isActive ? 'Active' : 'Inactive',
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  private generateEnrollmentCSV(): string {
    const headers = [
      'Employee Name',
      'Employee ID',
      'Batch',
      'Course',
      'Trainer',
      'Start Date',
      'Status',
      'Requested Date',
    ];
    const rows = this.filteredEnrollments.map((enrollment) => [
      enrollment.employee?.name || '',
      enrollment.employee?.employeeId || '',
      enrollment.batch?.batchName || '',
      enrollment.batch?.course?.title || '',
      enrollment.batch?.trainerName || '',
      enrollment.batch?.calendar?.startDate || '',
      enrollment.status || '',
      enrollment.requestedAt || '',
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
  getActiveTeamMembers(): number {
    return this.teamMembers.filter((m) => m.isActive).length;
  }

  getInactiveTeamMembers(): number {
    return this.teamMembers.filter((m) => m.isActive === false).length;
  }

  getPendingEnrollments(): number {
    return this.enrollments.filter((e) => e.status === 'pending').length;
  }

  getApprovedEnrollments(): number {
    return this.enrollments.filter((e) => e.status === 'approved').length;
  }

  getRejectedEnrollments(): number {
    return this.enrollments.filter((e) => e.status === 'rejected').length;
  }
}
