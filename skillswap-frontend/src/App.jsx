import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';

import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

import DashboardHome from './components/dashboard/DashboardHome';
import MySkills from './components/skills/MySkills';
import BrowseSkills from './components/skills/BrowseSkills';
import MyRequests from './components/requests/MyRequests';
import MySessions from './components/sessions/MySessions';
import NotificationsPage from './components/notifications/NotificationsPage';
import MyProfile from './components/profile/MyProfile';
import Settings from './components/settings/Settings';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import { AdminSkills, AdminRequests, AdminSessions, ActivityLogs } from './components/admin/AdminPages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <StudentLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="skills/my" element={<MySkills />} />
                <Route path="skills/browse" element={<BrowseSkills />} />
                <Route path="requests" element={<MyRequests />} />
                <Route path="sessions" element={<MySessions />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="sessions" element={<AdminSessions />} />
                <Route path="activity" element={<ActivityLogs />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
