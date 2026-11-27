import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MILESTONES,
  INITIAL_EMPLOYEES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getProjectCoverImage } from '../utils/projectImages';

const DataContext = createContext(null);
const STORAGE_PREFIX = 'constructa_v3_';

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const loadInitial = (key, fallback) => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(`Error loading ${key}:`, e);
    }
    return fallback;
  };

  const [rawProjects, setRawProjects] = useState(() => {
    const loaded = loadInitial('projects', INITIAL_PROJECTS);
    return loaded.map(p => ({
      ...p,
      coverImage: p.coverImage || getProjectCoverImage(p)
    }));
  });
  const [tasks, setTasks] = useState(() => {
    const loaded = loadInitial('tasks', INITIAL_TASKS);
    return loaded.map((t, idx) => {
      const assignees = (Array.isArray(t.assignedTo) && t.assignedTo.length > 0)
        ? t.assignedTo
        : (Array.isArray(t.assigneeIds) && t.assigneeIds.length > 0)
        ? t.assigneeIds
        : [
            INITIAL_EMPLOYEES[(idx + 1) % INITIAL_EMPLOYEES.length].id,
            INITIAL_EMPLOYEES[(idx + 3) % INITIAL_EMPLOYEES.length].id
          ];
      return {
        ...t,
        assignedTo: assignees,
        assigneeIds: assignees
      };
    });
  });
  const [milestones, setMilestones] = useState(() => loadInitial('milestones', INITIAL_MILESTONES));
  const [employees, setEmployees] = useState(() => loadInitial('employees', INITIAL_EMPLOYEES));
  const [notifications, setNotifications] = useState(() => loadInitial('notifications', INITIAL_NOTIFICATIONS));
  const [activities, setActivities] = useState(() => loadInitial('activities', INITIAL_ACTIVITIES));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projects', JSON.stringify(rawProjects));
  }, [rawProjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'activities', JSON.stringify(activities));
  }, [activities]);

  // Dynamically compute project progress from child tasks
  const projects = useMemo(() => {
    return rawProjects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      if (projTasks.length === 0) return proj;

      const totalProgress = projTasks.reduce((sum, t) => sum + (Number(t.progress) || 0), 0);
      const computedProg = Math.round(totalProgress / projTasks.length);
      return {
        ...proj,
        progress: computedProg,
        taskCount: projTasks.length,
        completedTaskCount: projTasks.filter(t => t.status === 'Completed').length
      };
    });
  }, [rawProjects, tasks]);

  // Role-filtered project and task views
  const visibleProjects = useMemo(() => {
    if (!currentUser) return projects;
    if (currentUser.role === 'super_admin' || currentUser.role === 'admin') {
      return projects;
    }
    return projects.filter(p => p.team?.includes(currentUser.id) || p.manager === currentUser.name);
  }, [projects, currentUser]);

  const visibleTasks = useMemo(() => {
    if (!currentUser) return tasks;
    if (currentUser.role === 'super_admin' || currentUser.role === 'admin') {
      return tasks;
    }
    return tasks.filter(t => (t.assignedTo || t.assigneeIds || [])?.includes(currentUser.id));
  }, [tasks, currentUser]);

  // Log activity helper
  const logActivity = useCallback((action, targetType, targetName, projectName, projectId) => {
    const act = {
      id: 'act-' + Date.now(),
      userName: currentUser?.name || 'Authorized Specialist',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      action,
      targetType,
      targetName,
      projectName: projectName || 'General',
      projectId: projectId || null,
      timestamp: 'Just now'
    };
    setActivities(prev => [act, ...prev]);
  }, [currentUser]);

  // Project CRUD
  const createProject = useCallback((projectData) => {
    const newProj = {
      ...projectData,
      id: 'proj-' + Date.now(),
      code: projectData.code || `CSA/AR/2026-27/0${rawProjects.length + 1}`,
      progress: 0,
      status: projectData.status || 'Active',
      team: projectData.team || [currentUser?.id || 'emp-1'],
      coverImage: projectData.coverImage || getProjectCoverImage(projectData)
    };
    setRawProjects(prev => [newProj, ...prev]);
    logActivity('created new project', 'project', newProj.name, newProj.name, newProj.id);
    showToast(`Project "${newProj.name}" created successfully.`, 'success');
    return newProj;
  }, [rawProjects.length, currentUser, logActivity, showToast]);

  const updateProject = useCallback((id, updatedFields) => {
    setRawProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    const proj = rawProjects.find(p => p.id === id);
    if (proj) {
      logActivity('updated project specifications', 'project', proj.name, proj.name, id);
      showToast(`Project "${proj.name}" updated.`, 'info');
    }
  }, [rawProjects, logActivity, showToast]);

  const deleteProject = useCallback((id) => {
    const proj = rawProjects.find(p => p.id === id);
    setRawProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (proj) {
      logActivity('deleted project', 'project', proj.name, proj.name, null);
      showToast(`Project "${proj.name}" removed from database.`, 'warning');
    }
  }, [rawProjects, logActivity, showToast]);

  // Task CRUD
  const createTask = useCallback((taskData) => {
    const proj = projects.find(p => p.id === taskData.projectId);
    const assignees = (taskData.assignedTo && taskData.assignedTo.length > 0)
      ? taskData.assignedTo
      : ['emp-1', 'emp-4'];
    const newTask = {
      ...taskData,
      assignedTo: assignees,
      assigneeIds: assignees,
      id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
      projectName: proj ? proj.name : 'General Work',
      progress: taskData.progress || (taskData.status === 'Completed' ? 100 : 0),
      comments: [],
      attachments: taskData.attachments || []
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('issued new task deliverable', 'task', newTask.title, newTask.projectName, newTask.projectId);
    showToast(`Task "${newTask.title}" added to ${newTask.projectName}.`, 'success');
    return newTask;
  }, [tasks.length, projects, logActivity, showToast]);

  const updateTask = useCallback((id, updatedFields) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    const task = tasks.find(t => t.id === id);
    if (task) {
      logActivity('updated task deliverable', 'task', task.title, task.projectName, task.projectId);
      showToast(`Task "${task.title}" updated.`, 'info');
    }
  }, [tasks, logActivity, showToast]);

  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (task) {
      logActivity('deleted task', 'task', task.title, task.projectName, task.projectId);
      showToast(`Task "${task.title}" removed.`, 'warning');
    }
  }, [tasks, logActivity, showToast]);

  const updateTaskStatus = useCallback((id, status) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let prog = t.progress;
        if (status === 'Completed') prog = 100;
        else if (status === 'Under Review' && prog < 90) prog = 90;
        else if (status === 'Pending') prog = 0;
        return { ...t, status, progress: prog };
      }
      return t;
    }));
  }, []);

  const updateTaskProgress = useCallback((id, newProgress) => {
    const prog = Math.max(0, Math.min(100, Number(newProgress)));
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let newStatus = t.status;
        if (prog === 100 && t.status !== 'Under Review') newStatus = 'Under Review';
        else if (prog > 0 && t.status === 'Pending') newStatus = 'In Progress';
        return { ...t, progress: prog, status: newStatus };
      }
      return t;
    }));
  }, []);

  const addComment = useCallback((taskId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: 'c_' + Date.now(),
      author: currentUser?.name || 'Architect',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: text.trim(),
      date: 'Just now'
    };
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, comments: [...(t.comments || []), newComment] };
      }
      return t;
    }));
    showToast('Coordination comment posted.', 'info');
  }, [currentUser, showToast]);

  const addAttachment = useCallback((taskId, fileObj) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, attachments: [...(t.attachments || []), fileObj] };
      }
      return t;
    }));
    showToast(`Attached file "${fileObj.name}".`, 'success');
  }, [showToast]);

  // Employee CRUD
  const createEmployee = useCallback((empData) => {
    const newEmp = {
      ...empData,
      id: `emp-${employees.length + 1}`,
      status: 'Active',
      availability: empData.availability || 'Available',
      assignedProjectsCount: 0,
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    setEmployees(prev => [...prev, newEmp]);
    logActivity('registered new specialist', 'employee', newEmp.name, 'Human Resources', null);
    showToast(`Specialist "${newEmp.name}" onboarded.`, 'success');
    return newEmp;
  }, [employees.length, logActivity, showToast]);

  const updateEmployee = useCallback((id, updatedFields) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
    showToast('Employee profile updated.', 'info');
  }, [showToast]);

  const deleteEmployee = useCallback((id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    if (emp) {
      showToast(`Removed "${emp.name}" from active roster.`, 'warning');
    }
  }, [employees, showToast]);

  // Milestone CRUD
  const addMilestone = useCallback((m) => {
    const newM = {
      ...m,
      id: 'ms-' + Date.now(),
      status: m.status || 'Pending',
      progress: m.progress || 0
    };
    setMilestones(prev => [newM, ...prev]);
    showToast(`Milestone "${newM.name}" scheduled.`, 'success');
    return newM;
  }, [showToast]);

  const updateMilestone = useCallback((id, fields) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...fields } : m));
    showToast('Milestone updated.', 'info');
  }, [showToast]);

  const deleteMilestone = useCallback((id) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
    showToast('Milestone removed.', 'warning');
  }, [showToast]);

  // Blocker reporter
  const reportTaskBlocker = useCallback((taskId, reason) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Blocked',
          blockerReason: reason
        };
      }
      return t;
    }));
    logActivity('reported site blocker', 'task', reason, 'Field Issues', taskId);
    showToast(`Site blocker flagged: ${reason}`, 'warning');
  }, [logActivity, showToast]);

  // Notifications
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  }, [showToast]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setRawProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setMilestones(INITIAL_MILESTONES);
    setEmployees(INITIAL_EMPLOYEES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.clear();
    showToast('CONSTRUCTA data restored to original seed state.', 'success');
  }, [showToast]);

  const value = {
    projects,
    rawProjects,
    visibleProjects,
    tasks,
    visibleTasks,
    milestones,
    employees,
    notifications,
    activities,
    // Project CRUD
    createProject,
    addProject: createProject,
    updateProject,
    deleteProject,
    // Task CRUD
    createTask,
    addTask: createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    moveTaskStatus: updateTaskStatus,
    updateTaskProgress,
    reportTaskBlocker,
    addComment,
    addCommentToTask: addComment,
    addAttachment,
    // Milestone CRUD
    addMilestone,
    updateMilestone,
    deleteMilestone,
    // Employee CRUD
    createEmployee,
    addEmployee: createEmployee,
    updateEmployee,
    deleteEmployee,
    // Notifications
    markNotificationAsRead,
    markNotificationRead: markNotificationAsRead,
    markAllNotificationsAsRead,
    markAllNotificationsRead: markAllNotificationsAsRead,
    resetToDefaults
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
