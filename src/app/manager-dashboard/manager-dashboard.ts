import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { Enrollment } from '../services/enrollment';
import { ManagerSidebar } from '../layout/manager-sidebar/manager-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  imports: [CommonModule, ManagerSidebar, RouterLink],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard implements OnInit {
  managerName = localStorage.getItem('name');
  managerId = localStorage.getItem('userId');

  teamMembers: any[] = [];
  pendingApprovals: any[] = [];

  totalTeamMembers = 0;
  activeTeamMembers = 0;
  inactiveTeamMembers = 0;
  pendingApprovalsCount = 0;

  constructor(
    private userService: User,
    private enrollmentService: Enrollment
  ) {}

  ngOnInit() {
    this.loadTeamStats();
    this.loadPendingApprovals();
  }

  loadTeamStats() {
    if (!this.managerId) {
      return;
    }

    this.userService.getEmployeesByManager(this.managerId).subscribe({
      next: (res: any) => {
        const employees = res.employees || [];

        this.teamMembers = employees.slice(0, 5);

        this.totalTeamMembers = employees.length;

        this.activeTeamMembers = employees.filter(
          (employee: any) => employee.isActive === true
        ).length;

        this.inactiveTeamMembers = employees.filter(
          (employee: any) => employee.isActive === false
        ).length;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  loadPendingApprovals() {
    if (!this.managerId) {
      return;
    }

    this.enrollmentService.getManagerPendingApprovals(this.managerId).subscribe({
      next: (res: any) => {
        this.pendingApprovals = (res.enrollments || []).slice(0, 5);
        this.pendingApprovalsCount = res.enrollments?.length || 0;
      },
      error: (err: any) => {
        console.log('Error loading pending approvals:', err);
      },
    });
  }

  approveEnrollment(enrollment: any) {
    if (confirm(`Approve enrollment request for ${enrollment.employee?.name}?`)) {
      this.enrollmentService.approveEnrollment(enrollment._id, 'Approved').subscribe({
        next: () => {
          this.loadPendingApprovals();
          this.loadTeamStats();
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
      this.enrollmentService.rejectEnrollment(enrollment._id, reason || 'Rejected').subscribe({
        next: () => {
          this.loadPendingApprovals();
        },
        error: (err) => {
          console.error('Error rejecting enrollment:', err);
          alert('Failed to reject enrollment');
        },
      });
    }
  }
}
