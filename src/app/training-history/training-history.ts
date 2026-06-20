import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSidebar } from '../employee-sidebar/employee-sidebar';
import { Enrollment } from '../services/enrollment';

@Component({
  selector: 'app-training-history',
  imports: [CommonModule, FormsModule, EmployeeSidebar],
  templateUrl: './training-history.html',
  styleUrl: './training-history.css',
})
export class TrainingHistory implements OnInit {
  completedTrainings: any[] = [];
  filteredTrainings: any[] = [];
  
  searchText = '';
  selectedCategory = 'all';

  constructor(private enrollmentService: Enrollment) {}

  ngOnInit() {
    this.loadTrainingHistory();
  }

  loadTrainingHistory() {
    const employeeId = localStorage.getItem('userId');
    
    if (!employeeId) {
      console.error('Employee ID not found');
      return;
    }

    this.enrollmentService.getEmployeeEnrollments(employeeId).subscribe({
      next: (res: any) => {
        // Filter only approved enrollments with completed batch status
        this.completedTrainings = (res.enrollments || []).filter(
          (enrollment: any) => 
            enrollment.status === 'approved' &&
            (enrollment.batch?.calendar?.status === 'completed' || 
             enrollment.batch?.status === 'completed')
        );
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading training history:', err);
      },
    });
  }

  applyFilters() {
    this.filteredTrainings = this.completedTrainings.filter((training) => {
      const search = this.searchText.toLowerCase();
      
      const matchesSearch =
        training.batch?.batchName?.toLowerCase().includes(search) ||
        training.batch?.course?.title?.toLowerCase().includes(search) ||
        training.batch?.trainerName?.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'all' ||
        training.batch?.course?.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  getTotalHours(): number {
    return this.completedTrainings.reduce((total, training) => {
      return total + (training.batch?.course?.durationHours || 0);
    }, 0);
  }

  get totalTrainings(): number {
    return this.completedTrainings.length;
  }
}
