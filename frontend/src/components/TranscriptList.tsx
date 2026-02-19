import React, { useState } from 'react';
import { MeetingTranscript, AnalysisResult } from '@/types';
import { formatDate } from '@/lib/utils';
import { Trash2, Eye, Share2, ChevronDown, ChevronUp, X, FileText, CheckCircle2, CircleDot, AlertCircle } from 'lucide-react';

interface TranscriptListProps {
  transcripts: MeetingTranscript[];
  onSelect?: (transcript: MeetingTranscript) => void;
  onDelete?: (id: string) => void;
  onExportToNotion?: (id: string) => void;
  loading?: boolean;
}

export const TranscriptList: React.FC<TranscriptListProps> = ({
  transcripts,
  onSelect,
  onDelete,
  onExportToNotion,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailTranscript, setDetailTranscript] = useState<MeetingTranscript | null>(null);

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
        return <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />;
      case 'in-progress':
        return <CircleDot className="w-4 h-4 text-blue-600 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600">Loading transcripts...</p>
      </div>
    );
  }

  if (transcripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 text-base">No transcripts found. Create your first one!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {transcripts.map((transcript) => (
          <div
            key={transcript.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Main Row */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {transcript.title}
                  </h4>
                  <span
                    className={`inline-block px-2 sm:px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      transcript.summary
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transcript.summary ? 'Analyzed' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatDate(transcript.createdAt)}
                </p>
                {/* Summary Preview */}
                {transcript.summary && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {transcript.summary}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {transcript.summary && (
                  <button
                    onClick={() => setDetailTranscript(transcript)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition text-xs sm:text-sm font-medium"
                    title="View full summary"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                )}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === transcript.id ? null : transcript.id)
                  }
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition text-xs sm:text-sm"
                  title="Expand details"
                >
                  {expandedId === transcript.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {onExportToNotion && (
                  <button
                    onClick={() => onExportToNotion(transcript.id)}
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-2 py-1.5 rounded-lg transition text-xs sm:text-sm"
                    title="Export to Notion"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(transcript.id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1.5 rounded-lg transition text-xs sm:text-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Section - Key Points & Action Items */}
            {expandedId === transcript.id && (
              <div className="border-t border-gray-100 px-4 sm:px-6 py-4 bg-gray-50 space-y-4 animate-in slide-in-from-top-2">
                {/* Key Points */}
                {transcript.keyPoints && transcript.keyPoints.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Key Points</h5>
                    <ul className="space-y-1.5">
                      {transcript.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items Count */}
                {transcript.actionItems && transcript.actionItems.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">
                      Action Items ({transcript.actionItems.length})
                    </h5>
                    <div className="space-y-2">
                      {transcript.actionItems.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200"
                        >
                          {getStatusIcon(item.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                              {item.owner && (
                                <span className="text-xs text-gray-500">→ {item.owner}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {transcript.actionItems.length > 3 && (
                        <button
                          onClick={() => setDetailTranscript(transcript)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          + {transcript.actionItems.length - 3} more items — View all
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {!transcript.summary && (
                  <p className="text-sm text-gray-500 italic">
                    This transcript hasn't been analyzed yet.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detailTranscript && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailTranscript.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(detailTranscript.createdAt)}</p>
              </div>
              <button
                onClick={() => setDetailTranscript(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Full Summary */}
              {detailTranscript.summary && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="text-base font-bold text-blue-900 mb-2">Summary</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{detailTranscript.summary}</p>
                </div>
              )}

              {/* Key Points */}
              {detailTranscript.keyPoints && detailTranscript.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">Key Points</h4>
                  <ul className="space-y-2">
                    {detailTranscript.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* All Action Items */}
              {detailTranscript.actionItems && detailTranscript.actionItems.length > 0 && (
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">
                    Action Items ({detailTranscript.actionItems.length})
                  </h4>
                  <div className="space-y-3">
                    {detailTranscript.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                      >
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                            {item.owner && (
                              <span className="text-xs text-gray-600">
                                <strong>Owner:</strong> {item.owner}
                              </span>
                            )}
                            {item.deadline && (
                              <span className="text-xs text-gray-600">
                                <strong>Deadline:</strong> {item.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original Transcript */}
              {detailTranscript.content && (
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">Original Transcript</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-48 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {detailTranscript.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
