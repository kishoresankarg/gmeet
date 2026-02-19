import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
    },
  };

  const style = styles[type];

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`rounded-xl border ${style.bg} ${style.border} p-3 sm:p-4 mb-4 shadow-sm`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${style.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm sm:text-base font-semibold ${style.title}`}>{title}</h3>
          <p className={`text-xs sm:text-sm mt-1 ${style.message} break-words`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
