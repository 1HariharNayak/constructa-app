import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}) {
  let Icon = AlertTriangle;
  let iconBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
  let confirmVariant = 'primary';

  if (type === 'danger') {
    Icon = AlertCircle;
    iconBg = 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
    confirmVariant = 'danger';
  } else if (type === 'warning') {
    Icon = AlertTriangle;
    iconBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    confirmVariant = 'primary';
  } else {
    Icon = HelpCircle;
    iconBg = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
    confirmVariant = 'secondary';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-700">
        <Button variant="outline" size="xs" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="xs"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
