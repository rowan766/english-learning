import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Document, ProcessedText } from '@/types';

interface AppStore extends AppState {
  // 状态更新方法
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDocument: (document: Document | null) => void;
  setCurrentText: (text: ProcessedText | null) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentAudioUrl: (url: string | null) => void;
  
  // 复合操作
  resetState: () => void;
  clearError: () => void;
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  currentDocument: null,
  currentText: null,
  isPlaying: false,
  currentAudioUrl: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 基础状态更新方法
      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setError: (error: string | null) => {
        set({ error }, false, 'setError');
      },

      setCurrentDocument: (document: Document | null) => {
        set({ currentDocument: document }, false, 'setCurrentDocument');
      },

      setCurrentText: (text: ProcessedText | null) => {
        set({ currentText: text }, false, 'setCurrentText');
      },

      setPlaying: (playing: boolean) => {
        set({ isPlaying: playing }, false, 'setPlaying');
      },

      setCurrentAudioUrl: (url: string | null) => {
        set({ currentAudioUrl: url }, false, 'setCurrentAudioUrl');
      },

      // 复合操作
      resetState: () => {
        set(initialState, false, 'resetState');
      },

      clearError: () => {
        set({ error: null }, false, 'clearError');
      },
    }),
    {
      name: 'app-store', // devtools中显示的名称
    }
  )
);

// 选择器函数 - 用于优化性能
export const selectLoading = (state: AppStore) => state.isLoading;
export const selectError = (state: AppStore) => state.error;
export const selectCurrentDocument = (state: AppStore) => state.currentDocument;
export const selectCurrentText = (state: AppStore) => state.currentText;
export const selectIsPlaying = (state: AppStore) => state.isPlaying;
export const selectCurrentAudioUrl = (state: AppStore) => state.currentAudioUrl;