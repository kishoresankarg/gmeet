'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useMeetingStore } from '@/store';
import { transcriptService } from '@/services/TranscriptService';
import { ActionItem } from '@/types';
import { Calendar as CalendarIcon, Plug, LogOut, CheckCircle, RefreshCcw } from 'lucide-react';

export default function CalendarPage() {
    const [tasks, setTasks] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Look for auth token in local storage
        const savedToken = localStorage.getItem('google_auth_token');
        if (savedToken) setToken(savedToken);

        // Check if returning from Google OAuth redirect
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            handleAuthCallback(code);
        } else {
            fetchAllTasks();
        }
    }, []);

    const fetchAllTasks = async () => {
        try {
            setLoading(true);
            const results = await transcriptService.sortTranscripts('date-newest', 0, 100);

            // Extract all action items across all transcripts
            let allTasks: ActionItem[] = [];
            results.forEach((transcript: any) => {
                if (transcript.actionItems && transcript.actionItems.length > 0) {
                    allTasks = [...allTasks, ...transcript.actionItems];
                }
            });

            setTasks(allTasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
            toast.error('Failed to load tasks for calendar');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectGoogle = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/calendar/auth-url');
            const data = await res.json();
            if (data.auth_url) {
                window.location.href = data.auth_url;
            } else {
                toast.error("Google Auth failed to initialize.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Backend OAuth endpoint unavailable");
        }
    };

    const handleAuthCallback = async (code: string) => {
        try {
            toast.loading("Connecting to Google...");
            const res = await fetch('http://localhost:8000/api/calendar/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            toast.dismiss();

            if (data.token) {
                localStorage.setItem('google_auth_token', data.token);
                setToken(data.token);
                toast.success("Google Calendar connected!");
                // Clean URL
                window.history.replaceState({}, document.title, "/calendar");
                fetchAllTasks();
            } else {
                toast.error("Failed to authenticate.");
            }
        } catch (e) {
            toast.dismiss();
            console.error(e);
            toast.error("Failed to exchange code.");
        }
    };

    const handleSyncTasks = async () => {
        if (!token) {
            toast.error("Please connect Google Calendar first.");
            return;
        }
        if (tasks.length === 0) {
            toast.error("No tasks to sync.");
            return;
        }

        try {
            toast.loading("Syncing all tasks to Google Calendar...");
            const res = await fetch('http://localhost:8000/api/calendar/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, items: tasks })
            });

            toast.dismiss();
            if (res.ok) {
                toast.success("All tasks successfully synced to Google Calendar!");
            } else {
                toast.error("Failed to sync. Token may have expired.");
                handleDisconnect();
            }
        } catch (e) {
            toast.dismiss();
            toast.error("Error during sync.");
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('google_auth_token');
        setToken(null);
        toast.success("Disconnected from Google Calendar");
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-[115px] pb-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto space-y-10">

                <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                        <CalendarIcon size={32} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Calendar Master Sync
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mb-10">
                        Automatically push all AI-generated Action Items and tasks directly into your Google Calendar. Never miss a deadline again.
                    </p>

                    {token ? (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                onClick={handleSyncTasks}
                                disabled={loading || tasks.length === 0}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Sync {tasks.length} Tasks to Google
                            </button>
                            <button
                                onClick={handleDisconnect}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnectGoogle}
                            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-2xl font-bold transition-all hover:shadow-lg shadow-blue-500/10 group"
                        >
                            <Plug className="w-5 h-5 group-hover:text-blue-600" />
                            Connect Google Calendar Account
                        </button>
                    )}
                </div>

                {/* Task Preview Grid */}
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        Tasks Ready for Sync <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{tasks.length} Items</span>
                    </h3>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="py-20 text-center text-slate-500 font-medium">
                            No tasks found across your meeting transcripts.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {tasks.map((task, idx) => (
                                <div key={idx} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl hover:border-blue-200 hover:bg-white transition-all">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <p className="font-bold text-slate-800 text-base italic leading-tight">{task.description}</p>
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                            Owner: {task.owner || 'TBD'}
                                        </div>
                                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-blue-600">
                                            {task.deadline || 'No Deadline'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
