import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // Redirect based on role
    if (role === 'admin') {
      router.navigate(['/admin-dashboard']);
    } else if (role === 'manager') {
      router.navigate(['/manager-dashboard']);
    } else if (role === 'employee') {
      router.navigate(['/employee-dashboard']);
    } else {
      // Unknown role, clear and stay on login
      localStorage.clear();
      return true;
    }
    return false;
  }

  return true;
};