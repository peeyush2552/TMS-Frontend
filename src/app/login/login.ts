import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  loginUser() {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);

        if (res.userId) {
          localStorage.setItem('userId', res.userId);
        }

        if (res.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (res.role === 'manager') {
          this.router.navigate(['/manager-dashboard']);
        } else if (res.role === 'employee') {
          this.router.navigate(['/employee-dashboard']);
        } else {
          this.errorMessage = 'Invalid user role';
        }
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Invalid email or password';
      },
    });
  }
}