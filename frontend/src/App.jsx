import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProjects from './pages/admin/ManageProjects';
import AdminReports from './pages/admin/Reports';

// Tester Pages
import TesterDashboard from './pages/tester/Dashboard';
import CreateBug from './pages/tester/CreateBug';
import MyBugReports from './pages/tester/MyBugReports';
import BugDetail from './pages/tester/BugDetail';

// Developer Pages
import DeveloperDashboard from './pages/developer/Dashboard';
import AssignedBugs from './pages/developer/AssignedBugs';
import BugWorkspace from './pages/developer/BugWorkspace';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ProjectTracking from './pages/manager/ProjectTracking';
import Analytics from './pages/manager/Analytics';

import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

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
