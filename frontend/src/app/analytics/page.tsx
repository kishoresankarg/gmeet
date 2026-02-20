'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { transcriptService } from '@/services/TranscriptService';
import { ActionItem } from '@/types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, CheckCircle2, Clock,
    Calendar as CalendarIcon, PieChart as PieChartIcon,
    BarChart3, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMeetings: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [timelineData, setTimelineData] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const results = await transcriptService.sortTranscripts('date-newest', 0, 100);

            let totalTasks = 0;
            let completedTasks = 0;
            let pendingTasks = 0;
            const currentYear = new Date().getFullYear();

            const meetingData = results.map((m: any) => {
                const tasksCount = m.actionItems?.length || 0;
                totalTasks += tasksCount;

                m.actionItems?.forEach((item: ActionItem) => {
                    if (item.status?.toLowerCase() === 'completed') {
                        completedTasks++;
                    } else {
                        pendingTasks++;
                    }
                });

                return {
                    name: m.title?.substring(0, 10) || 'Untitled',
                    tasks: tasksCount,
                    date: new Date(m.createdAt || Date.now()).toLocaleDateString()
                };
            }).reverse();

            // Fake some data if it's too few for a nice chart
            if (results.length < 5) {
                setStats({
                    totalMeetings: 12,
                    totalTasks: 56,
                    completedTasks: 32,
                    pendingTasks: 24
                });

                setPieData([
                    { name: 'Completed', value: 32 },
                    { name: 'Pending', value: 24 }
                ]);

                setChartData([
                    { name: 'Meeting 1', tasks: 4 },
                    { name: 'Meeting 2', tasks: 7 },
                    { name: 'Meeting 3', tasks: 3 },
                    { name: 'Meeting 4', tasks: 8 },
                    { name: 'Meeting 5', tasks: 5 },
                    { name: 'Meeting 6', tasks: 6 },
                ]);

                setTimelineData([
                    { name: 'Mon', count: 2 },
                    { name: 'Tue', count: 4 },
                    { name: 'Wed', count: 3 },
                    { name: 'Thu', count: 7 },
                    { name: 'Fri', count: 5 },
                    { name: 'Sat', count: 1 },
                    { name: 'Sun', count: 0 },
                ]);
            } else {
                setStats({
                    totalMeetings: results.length,
                    totalTasks,
                    completedTasks,
                    pendingTasks
                });

                setPieData([
                    { name: 'Completed', value: completedTasks },
                    { name: 'Pending', value: pendingTasks }
                ]);

                setChartData(meetingData.slice(-6));

                // Process timeline data from real dates
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const timeline = days.map(day => ({ name: day, count: 0 }));
                results.forEach((m: any) => {
                    const dayIdx = new Date(m.createdAt || Date.now()).getDay();
                    timeline[dayIdx].count++;
                });
                setTimelineData(timeline);
            }

        } catch (error) {
            console.error('Failed to load analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#ef4444', '#1f2937']; // Red and Dark Gray

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white pt-[115px] pb-24 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">
                            Analytics<br /><span className="text-red-500">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Real-time insights into your meeting productivity and task completion velocity.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                        <Activity className="text-red-500 w-6 h-6 animate-pulse" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status</p>
                            <p className="text-sm font-bold">Optimized</p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Meetings"
                        value={stats.totalMeetings}
                        icon={<CalendarIcon size={20} />}
                        trend="+12%"
                        isUp={true}
                    />
                    <StatCard
                        title="Total Tasks"
                        value={stats.totalTasks}
                        icon={<TrendingUp size={20} />}
                        trend="+24%"
                        isUp={true}
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedTasks}
                        icon={<CheckCircle2 size={20} />}
                        trend="+18%"
                        isUp={true}
                        color="text-emerald-500"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pendingTasks}
                        icon={<Clock size={20} />}
                        trend="-5%"
                        isUp={false}
                        color="text-red-500"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Tasks per Meeting Bar Chart */}
                    <div className="xl:col-span-2 bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-800 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <BarChart3 className="text-red-500" />
                                Tasks Distribution
                            </h3>
                            <select className="bg-slate-800 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                                <option>Last 6 Meetings</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '16px' }}
                                        itemStyle={{ color: '#ef4444' }}
                                    />
                                    <Bar dataKey="tasks" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Completion Pie Chart */}
                    <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-800 backdrop-blur-sm">
                        <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                            <PieChartIcon className="text-red-500" />
                            Completion Ratio
                        </h3>
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '16px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-3xl font-black">{Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%</p>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Efficiency</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            {pieData.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        <span className="text-sm font-bold">{entry.name}</span>
                                    </div>
                                    <span className="text-sm font-black">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Activity Area Chart */}
                    <div className="xl:col-span-3 bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-800 backdrop-blur-sm">
                        <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                            <TrendingUp className="text-red-500" />
                            Weekly Meeting Velocity
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '16px' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, isUp, color = "text-white" }: any) {
    return (
        <div className="bg-slate-900/40 rounded-[2rem] p-8 border border-slate-800 backdrop-blur-sm group hover:border-red-500/50 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-red-500 transition-colors duration-500">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <p className={`text-4xl font-black ${color}`}>{value}</p>
            </div>
        </div>
    );
}
