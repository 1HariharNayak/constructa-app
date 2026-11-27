import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are currently no items matching your criteria in this view.',
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-[#E7E9E3]">
      <div className="w-12 h-12 rounded-full bg-[#F6F6F2] border border-[#E7E9E3] flex items-center justify-center text-[#A77B50] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-[#242B27] mb-1">{title}</h3>
      <p className="text-xs text-[#777F79] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
}
