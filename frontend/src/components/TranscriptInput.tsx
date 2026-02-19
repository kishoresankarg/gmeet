import React, { useRef } from 'react';
import { Button } from './Button';
import { Upload } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Upload Meeting Transcript</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Sprint Planning - Q1 2025"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transcript Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your meeting transcript here or upload a file..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
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
        >
          Analyze Transcript
        </Button>
      </div>
    </div>
  );
};
