import { Routes } from '@angular/router';

import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { CreateUser } from './create-user/create-user';
import { CourseManagement } from './course-management/course-management';
import { CalendarManagement } from './calendar-management/calendar-management';
import { BatchManagement } from './batch-management/batch-management';
import { AdminReports } from './admin-reports/admin-reports';

import { ManagerDashboard } from './manager-dashboard/manager-dashboard';
import { ManagerTeam } from './manager-team/manager-team';
import { ManagerApprovals } from './manager-approvals/manager-approvals';
import { ManagerReports } from './manager-reports/manager-reports';

import { EmployeeDashboard } from './employee-dashboard/employee-dashboard';
import { AvailableBatches } from './available-batches/available-batches';
import { MyRequests } from './my-requests/my-requests';
import { TrainingHistory } from './training-history/training-history';

import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard],
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: 'reset-password',
    component: ResetPassword,
  },

  // Admin Routes

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [authGuard],
  },

  {
    path: 'create-user',
    component: CreateUser,
    canActivate: [authGuard],
  },

  {
    path: 'course-management',
    component: CourseManagement,
    canActivate: [authGuard],
  },

  {
    path: 'calendar-management',
    component: CalendarManagement,
    canActivate: [authGuard],
  },

  {
    path: 'batch-management',
    component: BatchManagement,
    canActivate: [authGuard],
  },

  {
    path: 'admin-reports',
    component: AdminReports,
    canActivate: [authGuard],
  },

  // Manager Routes

  {
    path: 'manager-dashboard',
    component: ManagerDashboard,
    canActivate: [authGuard],
  },

  {
    path: 'manager-team',
    component: ManagerTeam,
    canActivate: [authGuard],
  },

  {
    path: 'manager-approvals',
    component: ManagerApprovals,
    canActivate: [authGuard],
  },

  {
    path: 'manager-reports',
    component: ManagerReports,
    canActivate: [authGuard],
  },

  // Employee Routes

  {
    path: 'employee-dashboard',
    component: EmployeeDashboard,
    canActivate: [authGuard],
  },

  {
    path: 'available-batches',
    component: AvailableBatches,
    canActivate: [authGuard],
  },

  {
    path: 'my-requests',
    component: MyRequests,
    canActivate: [authGuard],
  },

  {
    path: 'training-history',
    component: TrainingHistory,
    canActivate: [authGuard],
  },

  // Fallback Route

  {
    path: '**',
    redirectTo: 'login',
  },
];