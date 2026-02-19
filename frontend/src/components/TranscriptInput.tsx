import React, { useRef } from 'react';
import { Button } from './Button';
import { Upload, Sparkles } from 'lucide-react';

interface TranscriptInputProps {
  onSubmit: (content: string, title: string) => void;
  loading?: boolean;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({ onSubmit, loading = false }) => {
  const [content, setContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value + event.clipboardData.getData('text'));
  };

  const handleSubmit = () => {
    if (content.trim() && title.trim()) {
      onSubmit(content, title);
      setContent('');
      setTitle('');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-500/5 p-6 sm:p-10 mb-8 border border-white/20 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-all duration-700" />

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full" />
          Upload Transcript
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider ml-1">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your meeting a name..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-lg transition-all outline-none placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider ml-1">
              Transcript Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste the conversation, notes, or transcript here..."
              rows={8}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-mono text-sm transition-all outline-none resize-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 mt-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 group/btn"
          >
            <Upload className="w-6 h-6 group-hover/btn:-translate-y-1 transition-transform" />
            Upload Document
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || !title.trim() || loading}
            className={`flex-[1.5] inline-flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group/prime ${!loading && content.trim() && title.trim() ? 'animate-pulse-subtle' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6 group-hover/prime:rotate-12 transition-transform" />
            )}
            {loading ? 'Analyzing...' : 'Analyze Transcript'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1); }
          50% { box-shadow: 0 25px 30px -5px rgb(59 130 246 / 0.3), 0 12px 15px -6px rgb(59 130 246 / 0.3); }
        }
      `}</style>
    </div>
  );
};
