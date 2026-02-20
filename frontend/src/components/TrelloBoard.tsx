import React from 'react';
import { Kanban, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface TrelloBoardProps {
    boardId?: string; // Optional if we want to default to yours
}

const TrelloBoard: React.FC<TrelloBoardProps> = ({ boardId = 'wAkk4hkM' }) => {
    const boardUrl = `https://trello.com/b/${boardId}.html`;

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Board Header/Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                            <Kanban size={28} strokeWidth={2.5} />
                        </div>
                        Workspace Board
                    </h2>
                    <p className="text-slate-500 font-bold mt-2 ml-14">
                        Real-time synchronization with your Trello project.
                    </p>
                </div>

                <div className="flex items-center gap-3 ml-14 md:ml-0">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all hover:scale-110 active:scale-90 shadow-sm"
                        title="Refresh Board"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <a
                        href={`https://trello.com/b/${boardId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                        OPEN IN TRELLO
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Embedded Board Container */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden group">
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />

                        <div className="rounded-[1.8rem] overflow-hidden bg-slate-50 aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/10] min-h-[600px] relative">
                            <iframe
                                src={boardUrl}
                                className="w-full h-full border-0 relative z-10"
                                title="Trello Board"
                                allow="clipboard-write"
                            />

                            {/* Visual Fallback Background */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                                <AlertCircle size={48} className="text-slate-300 mb-4" />
                                <h4 className="text-slate-900 font-black text-lg mb-2">Board Connection Pending</h4>
                                <p className="text-slate-500 text-sm max-w-xs font-medium">
                                    If the board doesn't appear above, please check your Trello visibility settings or use the dedicated link.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visibility Guide Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-4 border-b border-slate-50 pb-4">
                            Visibility Fix
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">1</div>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                    Open your board in <span className="text-blue-600 underline">Trello.com</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</div>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                    Click the <span className="text-slate-900 italic">"Workspace"</span> or <span className="text-slate-900 italic">"Private"</span> button top-left.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">3</div>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                    Change setting to <span className="text-emerald-600 py-0.5 px-1 bg-emerald-50 rounded">"Public"</span> for live embed visibility.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight leading-relaxed">
                                Why? Browsers block private Trello embeds for security. Making it public allows MeetPulse to project it safely here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help/Tips Footer */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-blue-900 font-black text-xs uppercase mb-2">Auto-Sync</p>
                    <p className="text-blue-800/70 text-sm font-medium">Cards created via "Analyze Transcript" appear here instantly after clicking Export.</p>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-900 font-black text-xs uppercase mb-2">Interactive</p>
                    <p className="text-emerald-800/70 text-sm font-medium">You can drag and drop cards directly within this view to change their status.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-slate-900 font-black text-xs uppercase mb-2">Collaboration</p>
                    <p className="text-slate-600 text-sm font-medium">Any changes made by your team members in Trello will update here in real-time.</p>
                </div>
            </div>
        </div>
    );
};

export default TrelloBoard;
