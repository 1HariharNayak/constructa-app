import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer,
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202824]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#E7E9E3] overflow-hidden z-10 transition-all duration-200 animate-in zoom-in-95 my-8`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#F0F2EC] bg-[#FAFAF8]">
          <div>
            <h3 className="text-base font-bold text-[#242B27] font-heading tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#777F79] mt-0.5 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="text-[#777F79] hover:text-[#242B27] p-1.5 rounded-lg hover:bg-[#E7E9E3]/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[#F0F2EC] bg-[#FAFAF8]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
