import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import Login from './services/pages/auth/Login';
import Register from './services/pages/auth/Register';
import ForgotPassword from './services/pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './services/pages/admin/Dashboard';
import ManageUsers from './services/pages/admin/ManageUsers';
import ManageProjects from './services/pages/admin/ManageProjects';
import AdminReports from './services/pages/admin/Reports';

// Tester Pages
import TesterDashboard from './services/pages/tester/Dashboard';
import CreateBug from './services/pages/tester/CreateBug';
import MyBugReports from './services/pages/tester/MyBugReports';
import BugDetail from './services/pages/tester/BugDetail';

// Developer Pages
import DeveloperDashboard from './services/pages/developer/Dashboard';
import AssignedBugs from './services/pages/developer/AssignedBugs';
import BugWorkspace from './services/pages/developer/BugWorkspace';

// Manager Pages
import ManagerDashboard from './services/pages/manager/Dashboard';
import ProjectTracking from './services/pages/manager/ProjectTracking';
import Analytics from './services/pages/manager/Analytics';

import ProtectedRoute from './services/pages/tester/components/common/ProtectedRoute';
import Layout from './services/pages/tester/components/layout/Layout';

function App() {
  const { user } = useAuth();

  const getDashboardByRole = () => {
    if (!user) return '/login';
    const routes = {
      admin: '/admin/dashboard',
      tester: '/tester/dashboard',
      developer: '/developer/dashboard',
      manager: '/manager/dashboard',
    };
    return routes[user.role] || '/login';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Redirect root to role dashboard */}
      <Route path="/" element={<Navigate to={getDashboardByRole()} replace />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Route>

      {/* Tester Routes */}
      <Route element={<ProtectedRoute allowedRoles={['tester']} />}>
        <Route element={<Layout />}>
          <Route path="/tester/dashboard" element={<TesterDashboard />} />
          <Route path="/tester/create-bug" element={<CreateBug />} />
          <Route path="/tester/my-bugs" element={<MyBugReports />} />
          <Route path="/tester/bug/:id" element={<BugDetail />} />
        </Route>
      </Route>

      {/* Developer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['developer']} />}>
        <Route element={<Layout />}>
          <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
          <Route path="/developer/assigned-bugs" element={<AssignedBugs />} />
          <Route path="/developer/bug/:id" element={<BugWorkspace />} />
        </Route>
      </Route>

      {/* Manager Routes */}
      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route element={<Layout />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/projects" element={<ProjectTracking />} />
          <Route path="/manager/analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;