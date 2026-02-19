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

export default function GeneratorPage() {
    const [loading, setLoading] = useState(false);
    const [transcripts, setTranscripts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc'>('date-newest');
    const [showHistory, setShowHistory] = useState(false);
    const { setAnalysisResult, analysisResult } = useMeetingStore();
    const [currentContent, setCurrentContent] = useState<string>('');

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    // Load transcripts on mount and whenever search/sort changes
    useEffect(() => {
        if (showHistory) {
            setPage(0);
            loadTranscripts(0, true);
        }
    }, [showHistory, sortBy]);

    const loadTranscripts = async (skip: number = 0, reset: boolean = false) => {
        try {
            let results: any[] = [];
            if (searchQuery) {
                results = await transcriptService.searchTranscripts(searchQuery);
                setTranscripts(results);
                setHasMore(false); // Search is not paginated for now
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
            // Step 1: Create transcript in MongoDB
            const transcript = await transcriptAPI.create(title, content);

            // Step 2: Analyze by ID — this runs AI analysis AND saves summary back to MongoDB
            const result = await transcriptAPI.analyzeById(transcript.id);

            setAnalysisResult(result);
            toast.success('Meeting notes analyzed & saved to database!');

            // Reload transcripts if history is open
            if (showHistory) {
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
                // JSON export
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
        // useEffect will trigger load
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

    const handleExportToNotion = async (id: string) => {
        try {
            toast.loading('Exporting to Notion...');
            const result = await transcriptService.exportToNotion(id);
            toast.dismiss();
            toast.success(result.message || 'Successfully exported to Notion');
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.response?.data?.detail || 'Failed to export to Notion');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
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

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setShowHistory(false)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${!showHistory
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            New Analysis
                        </button>
                        <button
                            onClick={() => setShowHistory(true)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ${showHistory
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {!showHistory ? (
                    <div className="space-y-12">
                        <TranscriptInput onSubmit={handleAnalyze} loading={loading} />
                        {analysisResult && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <AnalysisResults result={analysisResult} onExport={handleExport} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <TranscriptSearch
                            onSearch={handleSearch}
                            onDateFilter={handleDateFilter}
                            onSort={handleSort}
                            searchQuery={searchQuery}
                            sortBy={sortBy}
                        />
                        <TranscriptList
                            transcripts={transcripts}
                            onDelete={handleDeleteTranscript}
                            onExportToNotion={handleExportToNotion}
                        />

                        {hasMore && transcripts.length > 0 && (
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-sm"
                                >
                                    Load More Transcripts
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
