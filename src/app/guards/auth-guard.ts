import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Check if route is restricted by role
  const path = route.routeConfig?.path;
  
  // Admin routes
  if (path?.startsWith('admin-') || path === 'create-user' || 
      path === 'course-management' || path === 'calendar-management' || 
      path === 'batch-management') {
    if (role !== 'admin') {
      router.navigate(['/login']);
      return false;
    }
  }
  
  // Manager routes
  if (path?.startsWith('manager-')) {
    if (role !== 'manager' && role !== 'admin') {
      router.navigate(['/login']);
      return false;
    }
  }
  
  // Employee routes
  if (path?.startsWith('employee-') || path === 'available-batches' || 
      path === 'my-requests' || path === 'training-history') {
    if (role !== 'employee' && role !== 'admin') {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};