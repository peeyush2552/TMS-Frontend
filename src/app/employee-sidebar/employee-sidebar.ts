import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employee-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employee-sidebar.html',
  styleUrl: './employee-sidebar.css',
})
export class EmployeeSidebar {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}