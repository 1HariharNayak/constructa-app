import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  Project,
  Task,
  Milestone,
  Employee,
  Notification,
  Activity
} from './models/index.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'siteflow_super_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siteflow';

app.use(cors());
app.use(express.json());

// Socket.IO Real-time Connection
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined project_${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Broadcast helper
const broadcastEvent = (event, data) => {
  io.emit(event, data);
};

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTE ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  let role = 'Employee';
  let permissions = ['assigned_projects', 'assigned_tasks'];

  if (email.includes('admin')) {
    role = 'Super Admin';
    permissions = ['all_projects', 'manage_projects', 'manage_users', 'settings'];
  } else if (email.includes('manager')) {
    role = 'Admin';
    permissions = ['assigned_projects', 'create_tasks', 'manage_milestones'];
  }

  const user = { email, role, permissions };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  return res.json({ token, user });
});

// --- PROJECTS REST API ---
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    broadcastEvent('project_created', project);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    broadcastEvent('project_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    broadcastEvent('project_deleted', { id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASKS REST API ---
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    broadcastEvent('task_created', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    broadcastEvent('task_updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optional MongoDB connection (graceful fallback if local Mongo is not running)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch(() => console.log('[MongoDB] Local MongoDB offline; Frontend operates in high-fidelity prototype localStorage mode'));

server.listen(PORT, () => {
  console.log(`SITEFLOW Node/Express API running on port ${PORT}`);
});
