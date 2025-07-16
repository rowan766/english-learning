// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 文档上传相关类型
export interface UploadDocumentRequest {
  file: File;
}

export interface UploadDocumentResponse {
  documentId: string;
  filename: string;
  fileSize: number;
  uploadTime: string;
}

// 文档处理相关类型
export interface ProcessTextRequest {
  documentId?: string;
  text?: string;
  language?: 'en' | 'zh';
}

export interface ProcessTextResponse {
  processedText: ProcessedText[];
  originalText: string;
  language: string;
}

export interface ProcessedText {
  id: string;
  originalText: string;
  translatedText: string;
  words: WordInfo[];
  audioUrl?: string;
}

export interface WordInfo {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// 语音生成相关类型
export interface GenerateSpeechRequest {
  text: string;
  language?: 'en' | 'zh';
  voice?: string;
  speed?: number;
}

export interface GenerateSpeechResponse {
  audioUrl: string;
  duration: number;
  text: string;
}