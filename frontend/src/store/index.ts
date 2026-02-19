import { create } from 'zustand';
import { MeetingTranscript, AnalysisResult } from '@/types';

interface MeetingStore {
  transcripts: MeetingTranscript[];
  currentTranscript: MeetingTranscript | null;
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;

  setTranscripts: (transcripts: MeetingTranscript[]) => void;
  setCurrentTranscript: (transcript: MeetingTranscript | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  transcripts: [],
  currentTranscript: null,
  analysisResult: null,
  loading: false,
  error: null,

  setTranscripts: (transcripts) => set({ transcripts }),
  setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
