import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import {
  Calendar,
  User,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { isOverdue, formatDate } from '../../utils/formatters';

export function TaskDetailDrawer({
  isOpen,
  onClose,
  task,
  employees = [],
  projects = [],
  onUpdateTask,
  onMoveTaskStatus,
  onUpdateProgress,
  onAddComment,
  onReportBlocker,
  onEditTask,
  onDeleteTask,
  canManage = false
}) {
  const [commentInput, setCommentInput] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressVal, setProgressVal] = useState(task?.progress || 0);

  const [blockerModalOpen, setBlockerModalOpen] = useState(false);
  const [blockerReasonInput, setBlockerReasonInput] = useState('');

  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);
  const assignedIds = (task.assignedTo && task.assignedTo.length > 0)
    ? task.assignedTo
    : (task.assigneeIds && task.assigneeIds.length > 0)
    ? task.assigneeIds
    : [];
  let assignedList = employees.filter(e => assignedIds.includes(e.id));
  if (assignedList.length === 0 && employees.length > 0) {
    const charCode = task.id ? task.id.charCodeAt(task.id.length - 1) : 0;
    assignedList = [employees[(charCode + 1) % employees.length]];
  }
  const project = projects.find(p => p.id === task.projectId);

  const handleProgressSave = () => {
    onUpdateProgress(task.id, progressVal);
    setIsEditingProgress(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(task.id, commentInput);
    setCommentInput('');
  };

  const handleSimulateUpload = () => {
    const newDoc = {
      name: `Field_Inspection_Stamp_${Math.floor(100 + Math.random() * 900)}.pdf`,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      date: new Date().toISOString().slice(0, 10)
    };
    const updatedDocs = [...(task.attachments || []), newDoc];
    onUpdateTask(task.id, {
      attachments: updatedDocs,
      attachmentsCount: updatedDocs.length
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
            {task.id}
          </span>
          <span className="text-base font-bold truncate text-slate-900 dark:text-white">
            {task.title}
          </span>
        </div>
      }
      subtitle={`${task.projectName || project?.name} • Due ${formatDate(task.dueDate)}`}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {canManage && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => {
                    onClose();
                    onEditTask(task);
                  }}
                >
                  Edit Task
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => {
                    if (window.confirm(`Delete task ${task.id}?`)) {
                      onDeleteTask(task.id);
                      onClose();
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-xs text-slate-900 dark:text-slate-100">
        {/* Status & Priority Control Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</span>
            <select
              value={task.status}
              onChange={(e) => onMoveTaskStatus(task.id, e.target.value)}
              className="w-full p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-medium text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Priority</span>
            <PriorityBadge priority={task.priority} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Start Date</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{task.startDate || '—'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Due Date</span>
            <span className={`font-mono font-medium ${overdue ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Blocker alert box if blocked */}
        {task.status === 'Blocked' && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Active Construction Blocker</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {task.blockerReason || 'Unspecified site delay. Engineering assistance requested.'}
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onMoveTaskStatus(task.id, 'In Progress')}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 rounded hover:bg-rose-50 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 cursor-pointer"
              >
                Resolve & Resume Task
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Execution Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{task.progress}%</span>
              {!isEditingProgress ? (
                <button
                  onClick={() => {
                    setProgressVal(task.progress);
                    setIsEditingProgress(true);
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Adjust
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleProgressSave}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProgress(false)}
                    className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditingProgress ? (
            <div className="space-y-2 mt-2">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% Not Started</span>
                <span>50% In Progress</span>
                <span>100% Completed</span>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Description & Scope */}
        <div>
          <h4 className="font-bold text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
            Task Description & Engineering Scope
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            {task.description || 'No detailed scope provided.'}
          </div>
        </div>

        {/* Assigned Personnel */}
        <div>
          <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase tracking-wider">
            Assigned Personnel & Leads
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedList.map(emp => (
              <div
                key={emp.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{emp.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{emp.role}</div>
                </div>
              </div>
            ))}
            {assignedList.length === 0 && (
              <div className="text-xs text-slate-400 italic">No specialists currently assigned.</div>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Engineering Documents & Attachments ({task.attachments?.length || 0})
            </h4>
            <button
              onClick={handleSimulateUpload}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Simulate Upload</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {task.attachments?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{doc.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">({doc.size})</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{doc.date}</span>
              </div>
            ))}
            {(!task.attachments || task.attachments.length === 0) && (
              <div className="p-3 text-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
                No files attached. Use "Simulate Upload" to add field test slips or blueprints.
              </div>
            )}
          </div>
        </div>

        {/* Comments Feed */}
        <div>
          <h4 className="font-bold text-xs text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Field Updates & Discussion ({task.comments?.length || 0})
          </h4>

          {/* Comment input form */}
          <form onSubmit={handleCommentSubmit} className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write an inspection update or note for the crew..."
                className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
              />
              <Button type="submit" size="sm" icon={Send} disabled={!commentInput.trim()}>
                Post
              </Button>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-2.5">
            {task.comments?.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'}
                      alt={c.author}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="font-bold text-slate-900 dark:text-white">{c.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                  {c.text}
                </p>
              </div>
            ))}
            {(!task.comments || task.comments.length === 0) && (
              <div className="text-xs text-slate-400 italic">No comments recorded yet.</div>
            )}
          </div>
        </div>

        {/* Quick Report Blocker Button */}
        {task.status !== 'Blocked' && task.status !== 'Completed' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setBlockerModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Construction Delay / Blocker on this Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Blocker Modal */}
      {blockerModalOpen && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl mt-4 space-y-3">
          <h5 className="font-bold text-xs text-rose-700 dark:text-rose-300">
            Specify cause for halting task {task.id}:
          </h5>
          <textarea
            rows={3}
            value={blockerReasonInput}
            onChange={(e) => setBlockerReasonInput(e.target.value)}
            placeholder="e.g. Concrete cylinder break test failed at 28-day cure..."
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-slate-900 dark:text-white"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setBlockerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!blockerReasonInput.trim()}
              onClick={() => {
                onReportBlocker(task.id, blockerReasonInput);
                setBlockerModalOpen(false);
              }}
            >
              Confirm Blocker
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
