import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSidebar } from '../employee-sidebar/employee-sidebar';
import { Enrollment } from '../services/enrollment';

@Component({
  selector: 'app-my-requests',
  imports: [CommonModule, FormsModule, EmployeeSidebar],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.css',
})
export class MyRequests implements OnInit {
  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  
  selectedStatus = 'all';
  searchText = '';

  constructor(private enrollmentService: Enrollment) {}

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    const employeeId = localStorage.getItem('userId');
    
    if (!employeeId) {
      console.error('Employee ID not found');
      return;
    }

    this.enrollmentService.getEmployeeEnrollments(employeeId).subscribe({
      next: (res: any) => {
        this.enrollments = res.enrollments || [];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
      },
    });
  }

  applyFilters() {
    this.filteredEnrollments = this.enrollments.filter((enrollment) => {
      const search = this.searchText.toLowerCase();
      
      const matchesSearch =
        enrollment.batch?.batchName?.toLowerCase().includes(search) ||
        enrollment.batch?.course?.title?.toLowerCase().includes(search) ||
        enrollment.batch?.trainerName?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'all' ||
        enrollment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  get pendingCount(): number {
    return this.enrollments.filter(e => e.status === 'pending').length;
  }

  get approvedCount(): number {
    return this.enrollments.filter(e => e.status === 'approved').length;
  }

  get rejectedCount(): number {
    return this.enrollments.filter(e => e.status === 'rejected').length;
  }
}
