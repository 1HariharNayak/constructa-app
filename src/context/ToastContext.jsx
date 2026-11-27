import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => {
          let Icon = CheckCircle2;
          let iconColor = 'text-emerald-600 dark:text-emerald-400';
          let borderClass = 'border-l-4 border-l-emerald-600';

          if (toast.type === 'error' || toast.type === 'danger') {
            Icon = AlertCircle;
            iconColor = 'text-rose-600 dark:text-rose-400';
            borderClass = 'border-l-4 border-l-rose-600';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-500 dark:text-amber-400';
            borderClass = 'border-l-4 border-l-amber-500';
          } else if (toast.type === 'info') {
            Icon = Info;
            iconColor = 'text-blue-600 dark:text-blue-400';
            borderClass = 'border-l-4 border-l-blue-600';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-800 shadow-modal border border-slate-200 dark:border-slate-700 ${borderClass} transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-xs font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
