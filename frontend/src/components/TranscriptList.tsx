import React from 'react';
import { MeetingTranscript } from '@/types';
import { formatDate } from '@/lib/utils';
import { Trash2, Eye } from 'lucide-react';

interface TranscriptListProps {
  transcripts: MeetingTranscript[];
  onSelect?: (transcript: MeetingTranscript) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export const TranscriptList: React.FC<TranscriptListProps> = ({
  transcripts,
  onSelect,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return <div className="text-center py-6 sm:py-8 text-gray-600">Loading transcripts...</div>;
  }

  if (transcripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center border border-gray-100">
        <p className="text-gray-600 text-sm sm:text-base">No transcripts found. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">
                Title
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm hidden sm:table-cell">
                Created
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-900 text-xs sm:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transcripts.map((transcript) => (
              <tr key={transcript.id} className="hover:bg-gray-50 transition">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm truncate">
                  {transcript.title}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                  {formatDate(transcript.createdAt)}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      transcript.summary
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transcript.summary ? 'Analyzed' : 'Pending'}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                  {onSelect && (
                    <button
                      onClick={() => onSelect(transcript)}
                      className="inline-flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
                      <span className="hidden sm:inline">View</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transcript.id)}
                      className="inline-flex items-center justify-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
