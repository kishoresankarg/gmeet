'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useMeetingStore } from '@/store';
import { transcriptAPI } from '@/lib/services';
import { TranscriptInput } from '@/components/TranscriptInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { TranscriptList } from '@/components/TranscriptList';
import { TranscriptSearch } from '@/components/TranscriptSearch';
import { downloadFile } from '@/lib/utils';
import { transcriptService } from '@/services/TranscriptService';
import TrelloBoard from '@/components/TrelloBoard';
import { ActionItem } from '@/types';
import {
    generateGoogleCalendarLink,
    generateOutlookCalendarLink,
    generateICSContent
} from '@/lib/calendar';

export default function GeneratorPage() {
    const [loading, setLoading] = useState(false);
    const [transcripts, setTranscripts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc'>('date-newest');
    const [activeTab, setActiveTab] = useState<'new' | 'history' | 'board'>('new');
    const { setAnalysisResult, analysisResult } = useMeetingStore();
    const [currentContent, setCurrentContent] = useState<string>('');
    const [currentTranscriptId, setCurrentTranscriptId] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    // Load transcripts on mount and whenever search/sort changes
    useEffect(() => {
        if (activeTab === 'history') {
            setPage(0);
            loadTranscripts(0, true);
        }
    }, [activeTab, sortBy]);

    const loadTranscripts = async (skip: number = 0, reset: boolean = false) => {
        try {
            let results: any[] = [];
            if (searchQuery) {
                results = await transcriptService.searchTranscripts(searchQuery);
                setTranscripts(results);
                setHasMore(false);
            } else {
                results = await transcriptService.sortTranscripts(sortBy, skip, LIMIT);
                if (reset) {
                    setTranscripts(results);
                } else {
                    setTranscripts(prev => [...prev, ...results]);
                }
                setHasMore(results.length === LIMIT);
            }
        } catch (error) {
            console.error('Failed to load transcripts:', error);
            toast.error('Failed to load transcripts');
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadTranscripts(nextPage * LIMIT);
    };

    const handleAnalyze = async (content: string, title: string) => {
        setCurrentContent(content);
        setLoading(true);
        try {
            const transcript = await transcriptAPI.create(title, content);
            setCurrentTranscriptId(transcript.id);
            const result = await transcriptAPI.analyzeById(transcript.id);
            setAnalysisResult(result);
            toast.success('Meeting notes analyzed & saved to database!');
            if (activeTab === 'history') {
                loadTranscripts(0, true);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to analyze transcript');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'json' | 'pdf' | 'csv') => {
        try {
            toast.loading('Exporting...');
            let blob: Blob;
            let filename: string;

            if (format === 'pdf') {
                blob = await transcriptAPI.exportPdf(currentContent);
                filename = 'meeting_analysis.pdf';
            } else if (format === 'csv') {
                blob = await transcriptAPI.exportCsv(currentContent);
                filename = 'meeting_analysis.csv';
            } else {
                const jsonData = JSON.stringify(analysisResult, null, 2);
                blob = new Blob([jsonData], { type: 'application/json' });
                filename = 'meeting_analysis.json';
            }

            downloadFile(blob, filename);
            toast.dismiss();
            toast.success(`Exported as ${format.toUpperCase()}`);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.message || `Failed to export as ${format}`);
            console.error(error);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query) {
            try {
                const results = await transcriptService.searchTranscripts(query);
                setTranscripts(results);
                setHasMore(false);
            } catch (error) {
                toast.error('Failed to search transcripts');
            }
        } else {
            setPage(0);
            loadTranscripts(0, true);
        }
    };

    const handleDateFilter = async (fromDate: string, toDate: string) => {
        try {
            const results = await transcriptService.filterByDateRange(fromDate, toDate);
            setTranscripts(results);
            setHasMore(false);
            toast.success('Filtered by date range');
        } catch (error) {
            toast.error('Failed to filter transcripts');
        }
    };

    const handleSort = async (newSortBy: 'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc') => {
        setSortBy(newSortBy);
        setPage(0);
    };

    const handleDeleteTranscript = async (id: string) => {
        try {
            await transcriptService.deleteTranscript(id);
            setTranscripts(transcripts.filter(t => t.id !== id));
            toast.success('Transcript deleted');
        } catch (error) {
            toast.error('Failed to delete transcript');
        }
    };

    const handleExportToTrello = async (id: string) => {
        try {
            toast.loading('Exporting to Trello...');
            const result = await transcriptService.exportToTrello(id);
            toast.dismiss();
            if (result.success !== false) {
                toast.success(result.message || 'Successfully exported to Trello');
            } else {
                toast.error(result.message || 'Failed to export to Trello');
            }
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.response?.data?.detail || 'Failed to export to Trello');
        }
    };

    const handleCalendarExport = (
        _id: string,
        type: 'google' | 'outlook' | 'ics',
        title: string,
        items: ActionItem[]
    ) => {
        try {
            if (items.length === 0) {
                toast.error('No tasks found to add to calendar');
                return;
            }

            if (type === 'ics') {
                const content = generateICSContent(items, title);
                const blob = new Blob([content], { type: 'text/calendar' });
                downloadFile(blob, 'meeting_tasks.ics');
                toast.success('Calendar file ready!');
            } else {
                // For Google and Outlook, we open the first task immediately
                // This is now synchronous, so no popup blocker issues
                const link = type === 'google'
                    ? generateGoogleCalendarLink(items[0], title)
                    : generateOutlookCalendarLink(items[0], title);

                window.open(link, '_blank');

                if (items.length > 1) {
                    toast(`Opening first of ${items.length} tasks. Use .ICS to download all!`, {
                        icon: '📅',
                        duration: 4000
                    });
                } else {
                    toast.success(`Sending task to ${type === 'google' ? 'Google' : 'Outlook'}`);
                }
            }
        } catch (error) {
            console.error('Calendar error:', error);
            toast.error('Failed to generate calendar link');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-[115px] pb-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Generator
                        </h1>
                        <p className="text-lg text-slate-600">
                            Paste your transcript and let AI do the heavy lifting.
                        </p>
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'new'
                                ? 'bg-white text-blue-600 shadow-md scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'
                                }`}
                        >
                            New Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'history'
                                ? 'bg-white text-blue-600 shadow-md scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'
                                }`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('board')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'board'
                                ? 'bg-white text-blue-600 shadow-md scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'
                                }`}
                        >
                            Status Board
                        </button>
                    </div>
                </div>

                {activeTab === 'new' && (
                    <div className="space-y-12">
                        <TranscriptInput onSubmit={handleAnalyze} loading={loading} />
                        {analysisResult && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <AnalysisResults
                                    result={analysisResult}
                                    onExport={handleExport}
                                    onTrelloExport={() => currentTranscriptId && handleExportToTrello(currentTranscriptId)}
                                    onCalendarExport={(type, title, items) => currentTranscriptId && handleCalendarExport(currentTranscriptId, type, title, items)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <TranscriptSearch
                                onSearch={handleSearch}
                                onDateFilter={handleDateFilter}
                                onSort={setSortBy}
                            />
                        </div>

                        <TranscriptList
                            transcripts={transcripts}
                            onDelete={handleDeleteTranscript}
                            onExportToTrello={handleExportToTrello}
                            onExportToCalendar={handleCalendarExport}
                        />

                        {hasMore && transcripts.length > 0 && (
                            <div className="flex justify-center mt-12 pb-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-10 py-4 bg-white text-blue-600 border-2 border-blue-50 rounded-2xl font-bold hover:bg-blue-50 hover:border-blue-100 transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-blue-500/5"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                    ) : (
                                        'View Older Transcripts'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'board' && (
                    <TrelloBoard />
                )}
            </div>
        </div>
    );
}
