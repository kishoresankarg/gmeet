import apiClient from './api';
import { MeetingTranscript, AnalysisResult, ActionItem } from '@/types';

export const transcriptAPI = {
  // Analyze transcript (standalone, no save)
  analyze: async (content: string): Promise<AnalysisResult> => {
    const { data } = await apiClient.post('/transcripts/analyze', { content });
    return data;
  },

  // Analyze an existing transcript by ID (saves summary to MongoDB)
  analyzeById: async (id: string): Promise<AnalysisResult> => {
    const { data } = await apiClient.post(`/transcripts/${id}/analyze`);
    return data;
  },

  // Create new transcript
  create: async (title: string, content: string): Promise<MeetingTranscript> => {
    const { data } = await apiClient.post('/transcripts', { title, content });
    return data;
  },

  // Get all transcripts
  list: async (): Promise<MeetingTranscript[]> => {
    const { data } = await apiClient.get('/transcripts');
    return data;
  },

  // Get single transcript
  get: async (id: string): Promise<MeetingTranscript> => {
    const { data } = await apiClient.get(`/transcripts/${id}`);
    return data;
  },

  // Update transcript
  update: async (id: string, updates: Partial<MeetingTranscript>): Promise<MeetingTranscript> => {
    const { data } = await apiClient.put(`/transcripts/${id}`, updates);
    return data;
  },

  // Delete transcript
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transcripts/${id}`);
  },

  // Export as PDF
  exportPdf: async (content: string): Promise<Blob> => {
    const { data } = await apiClient.post('/transcripts/export/pdf', { content }, {
      responseType: 'blob',
    });
    return data;
  },

  // Export as CSV
  exportCsv: async (content: string): Promise<Blob> => {
    const { data } = await apiClient.post('/transcripts/export/csv', { content }, {
      responseType: 'blob',
    });
    return data;
  },

  // Export transcript (legacy)
  export: async (id: string, format: 'json' | 'pdf' | 'csv'): Promise<Blob> => {
    const { data } = await apiClient.get(`/transcripts/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return data;
  },

  // Save analysis results to a transcript
  saveAnalysis: async (id: string, analysis: { summary: string; keyPoints: string[]; actionItems: any[] }): Promise<MeetingTranscript> => {
    const { data } = await apiClient.put(`/transcripts/${id}/analysis`, analysis);
    return data;
  },

  // Search transcripts
  search: async (query: string): Promise<MeetingTranscript[]> => {
    const { data } = await apiClient.get('/transcripts/search', {
      params: { q: query },
    });
    return data;
  },
};

export const actionItemAPI = {
  // Update action item
  update: async (
    transcriptId: string,
    itemId: string,
    updates: Partial<ActionItem>
  ): Promise<ActionItem> => {
    const { data } = await apiClient.put(
      `/transcripts/${transcriptId}/action-items/${itemId}`,
      updates
    );
    return data;
  },

  // Delete action item
  delete: async (transcriptId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/transcripts/${transcriptId}/action-items/${itemId}`);
  },
};
