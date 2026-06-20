import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../services/user';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, Sidebar],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  name = '';
  email = '';
  role = 'manager';
  department = '';
  assignedManager = '';

  users: any[] = [];

  searchText = '';
  selectedRole = 'all';

  successMessage = '';
  errorMessage = '';

  isEditMode = false;
  selectedUserId = '';

  constructor(private userService: User) {}

  ngOnInit() {
    this.loadUsers();
  }

  createUser() {
      if (!this.name.trim()) {
    this.errorMessage = 'Name is required';
    this.successMessage = '';
    return;
  }

  if (!this.email.trim()) {
    this.errorMessage = 'Email is required';
    this.successMessage = '';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.email)) {
    this.errorMessage = 'Please enter a valid email address';
    this.successMessage = '';
    return;
  }

  if (!this.role) {
    this.errorMessage = 'Please select a role';
    this.successMessage = '';
    return;
  }

  if (!this.department) {
    this.errorMessage = 'Please select a department';
    this.successMessage = '';
    return;
  }

  if (this.role === 'employee' && !this.assignedManager) {
    this.errorMessage = 'Please select reporting manager';
    this.successMessage = '';
    return;
  }
    const userData: any = {
      
      name: this.name,
      email: this.email,
      role: this.role,
      department: this.department,
      assignedManager: this.role === 'employee' ? this.assignedManager : null,
      isActive: true,
    };

    if (this.isEditMode) {
      this.userService.updateUser(this.selectedUserId, userData).subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage =
            err.error?.message || 'Something went wrong';
        },
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage =
            err.error?.message || 'Something went wrong';
        },
      });
    }
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user._id;

    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.department = user.department;
    this.assignedManager = user.assignedManager?._id || '';
  }

  deleteUser(user: any) {
    if (
      confirm(
        user.isActive
          ? `Deactivate ${user.name}?`
          : `Activate ${user.name}?`
      )
    ) {
      this.userService.deleteUser(user._id).subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.loadUsers();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage =
            err.error?.message || 'Something went wrong';
        },
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.role = 'manager';
    this.department = '';
    this.assignedManager = '';
    this.isEditMode = false;
    this.selectedUserId = '';
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  get managers() {
    return this.users.filter((user) => user.role === 'manager');
  }

  get filteredUsers() {
  return this.users.filter((user) => {
    const search = this.searchText.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.employeeId?.toLowerCase().includes(search) ||
      user.department?.toLowerCase().includes(search);

    const matchesRole =
      this.selectedRole === 'all' || user.role === this.selectedRole;

    return matchesSearch && matchesRole;
  });
}
}