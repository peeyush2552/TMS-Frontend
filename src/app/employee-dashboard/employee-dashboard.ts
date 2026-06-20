import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeSidebar } from '../employee-sidebar/employee-sidebar';

@Component({
  selector: 'app-employee-dashboard',
  imports: [EmployeeSidebar, RouterLink],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard {
  employeeName = 'Employee';

  availableTrainings = 0;
  pendingRequests = 0;
  approvedTrainings = 0;
  completedTrainings = 0;
}