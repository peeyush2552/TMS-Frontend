import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Enrollment } from '../services/enrollment';
import { ManagerSidebar } from '../layout/manager-sidebar/manager-sidebar';

@Component({
  selector: 'app-manager-approvals',
  imports: [CommonModule, FormsModule, ManagerSidebar],
  templateUrl: './manager-approvals.html',
  styleUrl: './manager-approvals.css',
})
export class ManagerApprovals implements OnInit {
  managerId = localStorage.getItem('userId');
  managerName = localStorage.getItem('name');

  allEnrollments: any[] = [];
  filteredEnrollments: any[] = [];

  searchTerm = '';
  statusFilter = 'all';

  constructor(private enrollmentService: Enrollment) {}

  ngOnInit() {
    this.loadAllEnrollments();
  }

  loadAllEnrollments() {
    if (!this.managerId) {
      return;
    }

    this.enrollmentService.getManagerApprovals(this.managerId).subscribe({
      next: (res: any) => {
        this.allEnrollments = res.enrollments || [];
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error loading enrollments:', err);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.allEnrollments];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(
        (enrollment) => enrollment.status === this.statusFilter
      );
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.employee?.name?.toLowerCase().includes(term) ||
          enrollment.employee?.employeeId?.toLowerCase().includes(term) ||
          enrollment.batch?.batchName?.toLowerCase().includes(term) ||
          enrollment.batch?.course?.title?.toLowerCase().includes(term)
      );
    }

    this.filteredEnrollments = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  approveEnrollment(enrollment: any) {
    if (
      confirm(`Approve enrollment request for ${enrollment.employee?.name}?`)
    ) {
      this.enrollmentService
        .approveEnrollment(enrollment._id, 'Approved by manager')
        .subscribe({
          next: () => {
            this.loadAllEnrollments();
          },
          error: (err) => {
            console.error('Error approving enrollment:', err);
            alert('Failed to approve enrollment');
          },
        });
    }
  }

  rejectEnrollment(enrollment: any) {
    const reason = prompt('Reason for rejection (optional):');
    if (reason !== null) {
      this.enrollmentService
        .rejectEnrollment(enrollment._id, reason || 'Rejected by manager')
        .subscribe({
          next: () => {
            this.loadAllEnrollments();
          },
          error: (err) => {
            console.error('Error rejecting enrollment:', err);
            alert('Failed to reject enrollment');
          },
        });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getPendingCount(): number {
    return this.allEnrollments.filter((e) => e.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.allEnrollments.filter((e) => e.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.allEnrollments.filter((e) => e.status === 'rejected').length;
  }
}
