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
  const assignedList = employees.filter(e => task.assignedTo?.includes(e.id));
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
          <span className="font-mono text-sm font-bold bg-[#F6F6F2] text-[#242B27] border border-[#E7E9E3] px-2 py-0.5 rounded">
            {task.id}
          </span>
          <span className="text-base font-bold truncate text-[#242B27]">
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
                  className="text-[#C66C62] hover:bg-[#C66C62]/10"
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
      <div className="space-y-6 text-xs text-[#242B27]">
        {/* Status & Priority Control Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#F6F6F2] border border-[#E7E9E3]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#777F79] block mb-1">Status</span>
            <select
              value={task.status}
              onChange={(e) => onMoveTaskStatus(task.id, e.target.value)}
              className="w-full p-1.5 rounded-md border border-[#E7E9E3] bg-white font-medium text-xs focus:ring-1 focus:ring-[#A77B50]"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#777F79] block mb-1">Priority</span>
            <PriorityBadge priority={task.priority} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#777F79] block mb-1">Start Date</span>
            <span className="font-mono text-[#242B27] font-medium">{task.startDate || '—'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#777F79] block mb-1">Due Date</span>
            <span className={`font-mono font-medium ${overdue ? 'text-[#C66C62] font-bold' : 'text-[#242B27]'}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Blocker alert box if blocked */}
        {task.status === 'Blocked' && (
          <div className="p-3.5 rounded-xl bg-[#C66C62]/10 border border-[#C66C62]/30 text-[#C66C62] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-[#C66C62]" />
              <span>Active Construction Blocker</span>
            </div>
            <p className="text-xs text-[#242B27] leading-relaxed">
              {task.blockerReason || 'Unspecified site delay. Engineering assistance requested.'}
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onMoveTaskStatus(task.id, 'In Progress')}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#C66C62]/30 rounded hover:bg-[#C66C62]/10 text-[#C66C62] cursor-pointer"
              >
                Resolve & Resume Task
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="p-3.5 rounded-xl border border-[#E7E9E3] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-[#242B27] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#A77B50]" />
              Execution Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#242B27]">{task.progress}%</span>
              {!isEditingProgress ? (
                <button
                  onClick={() => {
                    setProgressVal(task.progress);
                    setIsEditingProgress(true);
                  }}
                  className="text-[11px] font-semibold text-[#A77B50] hover:underline cursor-pointer"
                >
                  Adjust
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleProgressSave}
                    className="text-[11px] font-semibold text-[#A77B50] hover:underline cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProgress(false)}
                    className="text-[11px] text-[#777F79] hover:underline cursor-pointer"
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
                className="w-full accent-[#A77B50] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#777F79]">
                <span>0% Not Started</span>
                <span>50% In Progress</span>
                <span>100% Completed</span>
              </div>
            </div>
          ) : (
            <div className="w-full bg-[#E7E9E3] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#A77B50] h-full rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Description & Scope */}
        <div>
          <h4 className="font-bold text-xs text-[#777F79] mb-1.5 uppercase tracking-wider">
            Task Description & Engineering Scope
          </h4>
          <div className="p-3.5 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3] leading-relaxed text-[#242B27] whitespace-pre-wrap">
            {task.description || 'No detailed scope provided.'}
          </div>
        </div>

        {/* Assigned Personnel */}
        <div>
          <h4 className="font-bold text-xs text-[#777F79] mb-2 uppercase tracking-wider">
            Assigned Personnel & Leads
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedList.map(emp => (
              <div
                key={emp.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-[#E7E9E3] bg-white"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E7E9E3]"
                />
                <div className="min-w-0">
                  <div className="font-bold text-[#242B27] truncate">{emp.name}</div>
                  <div className="text-[11px] text-[#777F79] truncate">{emp.role}</div>
                </div>
              </div>
            ))}
            {assignedList.length === 0 && (
              <div className="text-xs text-[#777F79] italic">No specialists currently assigned.</div>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-[#777F79] uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-[#A77B50]" />
              Engineering Documents & Attachments ({task.attachments?.length || 0})
            </h4>
            <button
              onClick={handleSimulateUpload}
              className="text-[11px] font-semibold text-[#A77B50] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Simulate Upload</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {task.attachments?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3] hover:border-[#D5D8CF] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-3.5 h-3.5 text-[#A77B50] shrink-0" />
                  <span className="font-medium text-[#242B27] truncate">{doc.name}</span>
                  <span className="text-[10px] text-[#777F79] shrink-0 font-mono">({doc.size})</span>
                </div>
                <span className="text-[10px] text-[#777F79] shrink-0 font-mono">{doc.date}</span>
              </div>
            ))}
            {(!task.attachments || task.attachments.length === 0) && (
              <div className="p-3 text-center bg-[#F6F6F2] rounded-lg border border-dashed border-[#E7E9E3] text-[#777F79]">
                No files attached. Use "Simulate Upload" to add field test slips or blueprints.
              </div>
            )}
          </div>
        </div>

        {/* Comments Feed */}
        <div>
          <h4 className="font-bold text-xs text-[#777F79] mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#657A6A]" />
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
                className="flex-1 p-2.5 rounded-lg border border-[#E7E9E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50] text-xs"
              />
              <Button type="submit" size="sm" icon={Send} disabled={!commentInput.trim()}>
                Post
              </Button>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-2.5">
            {task.comments?.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'}
                      alt={c.author}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="font-bold text-[#242B27]">{c.author}</span>
                  </div>
                  <span className="text-[10px] text-[#777F79] font-mono">{c.time}</span>
                </div>
                <p className="text-xs text-[#242B27] leading-relaxed pl-7">
                  {c.text}
                </p>
              </div>
            ))}
            {(!task.comments || task.comments.length === 0) && (
              <div className="text-xs text-[#777F79] italic">No comments recorded yet.</div>
            )}
          </div>
        </div>

        {/* Quick Report Blocker Button */}
        {task.status !== 'Blocked' && task.status !== 'Completed' && (
          <div className="pt-2 border-t border-[#E7E9E3]">
            <button
              onClick={() => setBlockerModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-[#C66C62]/40 text-[#C66C62] hover:bg-[#C66C62]/10 font-bold text-xs transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Construction Delay / Blocker on this Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Blocker Modal */}
      {blockerModalOpen && (
        <div className="p-4 bg-[#C66C62]/10 border border-[#C66C62]/30 rounded-xl mt-4 space-y-3">
          <h5 className="font-bold text-xs text-[#C66C62]">
            Specify cause for halting task {task.id}:
          </h5>
          <textarea
            rows={3}
            value={blockerReasonInput}
            onChange={(e) => setBlockerReasonInput(e.target.value)}
            placeholder="e.g. Concrete cylinder break test failed at 28-day cure..."
            className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white text-xs text-[#242B27]"
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
