import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'constructa_auth_user_v3';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to Super Admin (Anant Sharma)
    return DEMO_USERS.superadmin;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.includes('admin') || cleanEmail.includes('anant')) {
      setCurrentUser(DEMO_USERS.superadmin);
      return { success: true, role: 'Super Admin' };
    } else if (cleanEmail.includes('pm') || cleanEmail.includes('priya')) {
      setCurrentUser(DEMO_USERS.admin);
      return { success: true, role: 'Admin' };
    } else {
      setCurrentUser(DEMO_USERS.employee);
      return { success: true, role: 'Employee' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (roleKey) => {
    if (roleKey === 'super_admin' || roleKey === 'superadmin') {
      setCurrentUser(DEMO_USERS.superadmin);
    } else if (roleKey === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
    } else {
      setCurrentUser(DEMO_USERS.employee);
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;
  const isEmployee = currentUser?.role === 'employee';

  // Permission flags used across pages
  const canCreateProject = isSuperAdmin;
  const canEditProject = isAdmin;
  const canDeleteProject = isSuperAdmin;
  const canCreateTask = isAdmin;
  const canManageMilestones = isAdmin;
  const canManageEmployees = isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        isSuperAdmin,
        isAdmin,
        isEmployee,
        canCreateProject,
        canEditProject,
        canDeleteProject,
        canCreateTask,
        canManageMilestones,
        canManageEmployees
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
