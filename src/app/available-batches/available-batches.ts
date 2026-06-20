import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSidebar } from '../employee-sidebar/employee-sidebar';
import { BatchService } from '../services/batch';
import { Enrollment } from '../services/enrollment';

@Component({
  selector: 'app-available-batches',
  imports: [CommonModule, FormsModule, EmployeeSidebar],
  templateUrl: './available-batches.html',
  styleUrl: './available-batches.css',
})
export class AvailableBatches implements OnInit {
  batches: any[] = [];
  filteredBatches: any[] = [];
  
  searchText = '';
  selectedCategory = 'all';
  
  successMessage = '';
  errorMessage = '';
  
  enrollingBatchId: string | null = null;

  constructor(
    private batchService: BatchService,
    private enrollmentService: Enrollment
  ) {}

  ngOnInit() {
    this.loadAvailableBatches();
  }

  loadAvailableBatches() {
    this.batchService.getBatches().subscribe({
      next: (res: any) => {
        // Filter only open batches with available seats
        this.batches = res.filter(
          (batch: any) => 
            batch.status === 'open' && 
            batch.enrolledCount < batch.capacity
        );
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error loading batches:', err);
        this.errorMessage = 'Failed to load available batches';
      },
    });
  }

  applyFilters() {
    this.filteredBatches = this.batches.filter((batch) => {
      const search = this.searchText.toLowerCase();
      
      const matchesSearch =
        batch.batchName?.toLowerCase().includes(search) ||
        batch.course?.title?.toLowerCase().includes(search) ||
        batch.trainerName?.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'all' ||
        batch.course?.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  getAvailableSeats(batch: any): number {
    return batch.capacity - batch.enrolledCount;
  }

  enrollInBatch(batch: any) {
    const employeeId = localStorage.getItem('userId');
    
    if (!employeeId) {
      this.errorMessage = 'Employee ID not found. Please login again.';
      return;
    }

    if (confirm(`Enroll in ${batch.batchName}?`)) {
      this.enrollingBatchId = batch._id;
      this.successMessage = '';
      this.errorMessage = '';

      this.enrollmentService.createEnrollment({
        employeeId: employeeId,
        batchId: batch._id,
      }).subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'Enrollment request submitted successfully!';
          this.errorMessage = '';
          this.enrollingBatchId = null;
          
          // Refresh batches after 2 seconds
          setTimeout(() => {
            this.successMessage = '';
            this.loadAvailableBatches();
          }, 2000);
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'Failed to submit enrollment request';
          this.successMessage = '';
          this.enrollingBatchId = null;
        },
      });
    }
  }

  isEnrolling(batchId: string): boolean {
    return this.enrollingBatchId === batchId;
  }
}
