import mongoose from 'mongoose';

// Project Schema
const ProjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Commercial High-Rise' },
  description: String,
  location: { type: String, required: true },
  manager: { type: String, required: true },
  managerEmail: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Delayed', 'Completed'],
    default: 'Planning'
  },
  progress: { type: Number, default: 0 },
  coverImage: String,
  assignedAdmins: [String],
  assignedEmployees: [{ type: String }]
}, { timestamps: true });

// Task Schema
const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  projectId: { type: String, required: true },
  projectName: String,
  milestoneId: String,
  assignedTo: [String],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Under Review', 'Completed', 'Blocked'],
    default: 'Pending'
  },
  progress: { type: Number, default: 0 },
  startDate: Date,
  dueDate: { type: Date, required: true },
  blockerReason: String,
  attachmentsCount: { type: Number, default: 0 },
  attachments: [{
    name: String,
    size: String,
    date: String
  }],
  comments: [{
    author: String,
    avatar: String,
    time: String,
    text: String
  }]
}, { timestamps: true });

// Milestone Schema
const MilestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: String, required: true },
  projectName: String,
  startDate: Date,
  targetDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Delayed', 'Completed'],
    default: 'Pending'
  },
  progress: { type: Number, default: 0 },
  description: String
}, { timestamps: true });

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  department: String,
  avatar: String,
  phone: String,
  capacity: { type: Number, default: 50 },
  status: { type: String, default: 'Active' },
  assignedProjects: [String],
  bio: String
}, { timestamps: true });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, default: 'Just now' },
  read: { type: Boolean, default: false },
  projectId: String,
  taskId: String
}, { timestamps: true });

// Activity Schema
const ActivitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  avatar: String,
  action: { type: String, required: true },
  target: { type: String, required: true },
  detail: String,
  timestamp: { type: String, default: 'Just now' },
  projectId: String
}, { timestamps: true });

export const Project = mongoose.model('Project', ProjectSchema);
export const Task = mongoose.model('Task', TaskSchema);
export const Milestone = mongoose.model('Milestone', MilestoneSchema);
export const Employee = mongoose.model('Employee', EmployeeSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
export const Activity = mongoose.model('Activity', ActivitySchema);
