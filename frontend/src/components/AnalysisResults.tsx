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
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <CircleDot className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      {result.summary && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Summary</h3>
          <p className="text-blue-800">{result.summary}</p>
        </div>
      )}

      {/* Key Points */}
      {result.keyPoints && result.keyPoints.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Key Points</h3>
          <ul className="space-y-2">
            {result.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {result.actionItems && result.actionItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Action Items</h3>
          <div className="space-y-3">
            {result.actionItems.map((item: ActionItem) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900">{item.description}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  {item.owner && (
                    <p className="text-sm text-gray-600">
                      <strong>Owner:</strong> {item.owner}
                    </p>
                  )}
                  {item.deadline && (
                    <p className="text-sm text-gray-600">
                      <strong>Deadline:</strong> {formatDate(item.deadline)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      {onExport && (
        <div className="flex gap-2">
          <button
            onClick={() => onExport('json')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm"
          >
            Export JSON
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm"
          >
            Export PDF
          </button>
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm"
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
};
