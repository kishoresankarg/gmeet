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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Upload Meeting Transcript</h2>

      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Sprint Planning - Q1 2025"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
        />
      </div>

      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Transcript Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your meeting transcript here or upload a file..."
          rows={6}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs sm:text-sm transition-all resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:flex-1 justify-center hover:shadow-md transform hover:scale-105 transition-all duration-200"
        >
          <Upload className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="font-semibold">Upload File</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={!content.trim() || !title.trim()}
          loading={loading}
          className="w-full sm:flex-1 justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="font-semibold">Analyze Transcript</span>
        </Button>
      </div>
    </div>
  );
};
