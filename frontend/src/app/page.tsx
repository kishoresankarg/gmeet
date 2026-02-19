'use client';

import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useMeetingStore } from '@/store';
import { transcriptAPI } from '@/lib/services';
import { TranscriptInput } from '@/components/TranscriptInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { downloadFile } from '@/lib/utils';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { setAnalysisResult, analysisResult } = useMeetingStore();
  const [currentContent, setCurrentContent] = useState<string>('');

  const handleAnalyze = async (content: string, title: string) => {
    setCurrentContent(content);
    setLoading(true);
    try {
      // Create transcript
      const transcript = await transcriptAPI.create(title, content);

      // Analyze it
      const result = await transcriptAPI.analyze(content);

      setAnalysisResult(result);
      toast.success('Meeting notes analyzed successfully!');
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

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Meeting Notes Generator
            </h1>
            <p className="text-lg text-gray-600">
              Transform your meeting transcripts into actionable insights with AI
            </p>
          </div>

          {/* Main Content */}
          <TranscriptInput onSubmit={handleAnalyze} loading={loading} />

          {/* Results */}
          {analysisResult && (
            <AnalysisResults
              result={analysisResult}
              onExport={handleExport}
            />
          )}
        </div>
      </div>
    </>
  );
}
