export interface MeetingTranscript {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  keyPoints?: string[];
  actionItems?: ActionItem[];
}

export interface ActionItem {
  id: string;
  description: string;
  owner?: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  duration?: number;
  participantCount?: number;
}

export interface ExportOptions {
  format: 'json' | 'pdf' | 'csv';
  includeAttachments?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
