import apiClient from '@/lib/api';
import { AnalysisResult } from '@/types';

export const transcriptService = {
  // Analyze a transcript
  async analyzeTranscript(content: string): Promise<AnalysisResult> {
    const response = await apiClient.post('/transcripts/analyze', { content });
    return response.data;
  },

  // Export to PDF
  async exportPDF(content: string): Promise<Blob> {
    const response = await apiClient.post('/transcripts/export/pdf', { content }, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export to CSV
  async exportCSV(content: string): Promise<Blob> {
    const response = await apiClient.post('/transcripts/export/csv', { content }, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export to Notion
  async exportToNotion(transcriptId: string): Promise<any> {
    const response = await apiClient.post(`/transcripts/${transcriptId}/export/notion`);
    return response.data;
  },

  // Search transcripts
  async searchTranscripts(query: string): Promise<any[]> {
    const response = await apiClient.get('/transcripts/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Filter by date range
  async filterByDateRange(fromDate: string, toDate: string): Promise<any[]> {
    const response = await apiClient.get('/transcripts/filter/date-range', {
      params: { from_date: fromDate, to_date: toDate },
    });
    return response.data;
  },

  // Sort transcripts
  async sortTranscripts(
    sortBy: 'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc',
    skip: number = 0,
    limit: number = 10
  ): Promise<any[]> {
    const response = await apiClient.get('/transcripts/sort', {
      params: { sort_by: sortBy, skip, limit },
    });
    return response.data;
  },

  // List all transcripts
  async listTranscripts(skip: number = 0, limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/transcripts', {
      params: { skip, limit },
    });
    return response.data;
  },

  // Get a specific transcript
  async getTranscript(id: string): Promise<any> {
    const response = await apiClient.get(`/transcripts/${id}`);
    return response.data;
  },

  // Delete a transcript
  async deleteTranscript(id: string): Promise<any> {
    const response = await apiClient.delete(`/transcripts/${id}`);
    return response.data;
  },
};
