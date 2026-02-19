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
    return <div className="text-center py-8">Loading transcripts...</div>;
  }

  if (transcripts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No transcripts found. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Created
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transcripts.map((transcript) => (
              <tr key={transcript.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {transcript.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(transcript.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      transcript.summary
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transcript.summary ? 'Analyzed' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  {onSelect && (
                    <button
                      onClick={() => onSelect(transcript)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transcript.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
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
