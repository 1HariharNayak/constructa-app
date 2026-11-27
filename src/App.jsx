import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Tasks } from './pages/Tasks';
import { TaskBoard } from './pages/TaskBoard';
import { Calendar } from './pages/Calendar';
import { Milestones } from './pages/Milestones';
import { Team } from './pages/Team';
import { Reports } from './pages/Reports';
import { ActivityLogs } from './pages/ActivityLogs';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleGuard({ children, allowEmployee = true }) {
  const { isEmployee } = useAuth();
  if (!allowEmployee && isEmployee) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="board" element={<TaskBoard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="team" element={<Team />} />

        {/* Protected from standard field employees */}
        <Route
          path="reports"
          element={
            <RoleGuard allowEmployee={false}>
              <Reports />
            </RoleGuard>
          }
        />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="notifications" element={<Notifications />} />
        <Route
          path="settings"
          element={
            <RoleGuard allowEmployee={false}>
              <Settings />
            </RoleGuard>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
