import React from 'react';

interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'danger';
  label?: string;
  pulse?: boolean;
}

const statusColors: Record<'good' | 'warning' | 'danger', string> = {
  good: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
}) => {
  const color = statusColors[status];

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {pulse && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className="relative inline-flex h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      {label && (
        <span className="text-sm text-gray-300 font-medium">{label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
