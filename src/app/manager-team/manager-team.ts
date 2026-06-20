import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user';
import { ManagerSidebar } from '../layout/manager-sidebar/manager-sidebar';

@Component({
  selector: 'app-manager-team',
  imports: [CommonModule, FormsModule, ManagerSidebar],
  templateUrl: './manager-team.html',
  styleUrl: './manager-team.css',
})
export class ManagerTeam implements OnInit {
  managerId = localStorage.getItem('userId');

  employees: any[] = [];
  searchText = '';
  statusFilter = '';

  constructor(private userService: User) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    if (!this.managerId) {
      return;
    }

    this.userService.getEmployeesByManager(this.managerId).subscribe({
      next: (res: any) => {
        this.employees = res.employees || [];
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  get filteredEmployees() {
    return this.employees.filter((employee: any) => {
      const searchMatch =
        !this.searchText ||
        employee.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.employeeId
          ?.toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        employee.department
          ?.toLowerCase()
          .includes(this.searchText.toLowerCase());

      const statusMatch =
        !this.statusFilter ||
        String(employee.isActive) === this.statusFilter;

      return searchMatch && statusMatch;
    });
  }
}