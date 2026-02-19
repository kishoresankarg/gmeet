import React from 'react';
import { AnalysisResult, ActionItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, CircleDot, AlertCircle } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onExport?: (format: 'json' | 'pdf' | 'csv') => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onExport }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />;
      case 'in-progress':
        return <CircleDot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary */}
      {result.summary && (
        <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200 shadow">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3">Summary</h3>
          <p className="text-blue-800 text-sm sm:text-base leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Key Points */}
      {result.keyPoints && result.keyPoints.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Key Points</h3>
          <ul className="space-y-2 sm:space-y-3">
            {result.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {result.actionItems && result.actionItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Action Items</h3>
          <div className="space-y-3">
            {result.actionItems.map((item: ActionItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-shrink-0 flex items-start justify-between sm:flex-col gap-2 w-full sm:w-auto">
                  <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">{item.description}</p>
                  <div className="mt-2 space-y-1">
                    {item.owner && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Owner:</strong> {item.owner}
                      </p>
                    )}
                    {item.deadline && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Deadline:</strong> {formatDate(item.deadline)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      {onExport && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => onExport('json')}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm transition"
          >
            Export JSON
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => onExport('csv')}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm transition"
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
};
