import React, { useState } from 'react';
import { AnalysisResult, ActionItem } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  CircleDot,
  AlertCircle,
  FileJson,
  FileText,
  Table,
  Kanban,
  Users,
  Calendar,
  ExternalLink,
  Download
} from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onExport?: (format: 'json' | 'pdf' | 'csv') => void;
  onTrelloExport?: () => void;
  onCalendarExport?: (type: 'google' | 'outlook' | 'ics', title: string, items: ActionItem[]) => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onExport,
  onTrelloExport,
  onCalendarExport
}) => {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'in-progress':
        return <CircleDot className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-300 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Summary Page-style Header */}
      {result.summary && (
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            Executive Summary
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed font-medium">
            {result.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Points Card */}
        {result.keyPoints && result.keyPoints.length > 0 && (
          <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} strokeWidth={2.5} />
              </div>
              Key Highlights
            </h3>
            <ul className="space-y-6 flex-1">
              {result.keyPoints.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <div className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                  <span className="text-slate-600 text-base leading-relaxed font-medium italic group-hover:text-slate-900 transition-colors">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items Card */}
        {result.actionItems && result.actionItems.length > 0 && (
          <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              Action Items
            </h3>
            <div className="space-y-5 flex-1">
              {result.actionItems.map((item: ActionItem) => (
                <div
                  key={item.id}
                  className="group flex flex-col gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-700 transition-colors italic">
                      {item.description}
                    </p>
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      {getStatusIcon(item.status)}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5 mt-auto pt-4 border-t border-slate-100/50">
                    {item.owner && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                        <Users size={14} className="text-blue-500" />
                        <span>{item.owner}</span>
                      </div>
                    )}
                    {item.deadline && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{formatDate(item.deadline)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Professional Integration Dock */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/15 transition-colors duration-1000" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
            <h4 className="text-white font-black text-lg uppercase tracking-[0.3em] mb-2 font-mono">Export Forge</h4>
            <p className="text-slate-400 text-sm font-bold max-w-xs">Distribute your meeting intelligence across your workflow tools instantly.</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-5">
            {/* Integration Suite */}
            <div className="flex items-center gap-4 pr-0 xl:pr-8 xl:border-r border-slate-800">
              {onTrelloExport && (
                <button
                  onClick={onTrelloExport}
                  className="flex items-center gap-3 px-7 py-3.5 bg-[#0079BF] text-white hover:bg-[#026aa7] rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-[0_10px_20px_-5px_rgba(0,121,191,0.3)] active:scale-95 group/btn"
                >
                  <Kanban className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                  TRELLO BOARD
                </button>
              )}

              {onCalendarExport && (
                <div className="relative">
                  <button
                    onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                    className="flex items-center gap-3 px-7 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] active:scale-95 group/btn"
                  >
                    <Calendar className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    CALENDAR SYNC
                  </button>

                  {showCalendarMenu && (
                    <div className="absolute bottom-full left-0 mb-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                      <div className="p-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Export All Tasks</p>
                      </div>
                      <button
                        onClick={() => { onCalendarExport('google', result.summary?.substring(0, 50) || 'Meeting', result.actionItems || []); setShowCalendarMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <ExternalLink size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Google Calendar</span>
                      </button>
                      <button
                        onClick={() => { onCalendarExport('outlook', result.summary?.substring(0, 50) || 'Meeting', result.actionItems || []); setShowCalendarMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <ExternalLink size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Outlook Calendar</span>
                      </button>
                      <button
                        onClick={() => { onCalendarExport('ics', result.summary?.substring(0, 50) || 'Meeting', result.actionItems || []); setShowCalendarMenu(false); }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 border-t border-slate-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <Download size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Download .ICS</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Document Exports */}
            {onExport && (
              <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-[1.5rem] border border-slate-700/50 backdrop-blur-sm">
                <button
                  onClick={() => onExport('pdf')}
                  className="group flex flex-col items-center justify-center w-14 h-14 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all hover:scale-110"
                  title="Download PDF"
                >
                  <FileText className="w-6 h-6 mb-0.5" />
                  <span className="text-[8px] font-black uppercase">PDF</span>
                </button>
                <button
                  onClick={() => onExport('csv')}
                  className="group flex flex-col items-center justify-center w-14 h-14 text-slate-400 hover:text-white hover:bg-emerald-500/20 rounded-2xl transition-all hover:scale-110"
                  title="Download CSV"
                >
                  <Table className="w-6 h-6 mb-0.5" />
                  <span className="text-[8px] font-black uppercase">CSV</span>
                </button>
                <button
                  onClick={() => onExport('json')}
                  className="group flex flex-col items-center justify-center w-14 h-14 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded-2xl transition-all hover:scale-110"
                  title="Download JSON"
                >
                  <FileJson className="w-6 h-6 mb-0.5" />
                  <span className="text-[8px] font-black uppercase">JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
