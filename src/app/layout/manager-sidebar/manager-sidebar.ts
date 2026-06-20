import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-manager-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './manager-sidebar.html',
  styleUrl: './manager-sidebar.css',
})
export class ManagerSidebar {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}