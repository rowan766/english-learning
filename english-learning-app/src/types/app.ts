import type { ProcessedText, WordInfo } from './api';

// 应用主题类型
export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

// 用户设置类型
export interface UserSettings {
  language: 'en' | 'zh';
  autoPlay: boolean;
  speechSpeed: number;
  voiceType: string;
  theme: AppTheme;
}

// 文档管理类型
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'docx';
  size: number;
  uploadTime: string;
  lastModified: string;
  processedTextId?: string;
}

// 词典条目类型
export interface DictionaryEntry {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  addedTime: string;
  reviewCount: number;
  lastReviewed?: string;
  isMarked: boolean;
}

// 学习进度类型
export interface StudyProgress {
  totalWords: number;
  learnedWords: number;
  reviewedWords: number;
  studyTime: number; // 分钟
  lastStudyTime: string;
  streak: number; // 连续学习天数
}

// 应用状态类型
export interface AppState {
  isLoading: boolean;
  error: string | null;
  currentDocument: Document | null;
  currentText: ProcessedText | null;
  isPlaying: boolean;
  currentAudioUrl: string | null;
}