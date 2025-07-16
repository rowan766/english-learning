// 应用信息
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_TITLE || 'English Learning App',
  shortName: 'EnglishApp',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || '英语学习应用 - 支持文档上传、语音播放、词典管理',
  author: 'English Learning Team',
} as const;

// API配置
export const API_CONFIG = {
  baseURL: '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  retryCount: 3,
  retryDelay: 1000,
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
  allowedExtensions: (import.meta.env.VITE_ALLOWED_FILE_TYPES || '.pdf,.txt,.docx,.doc')
    .split(',')
    .map((ext: string) => ext.trim()) as string[],
} as const;

// 语音配置
export const SPEECH_CONFIG = {
  defaultLanguage: 'en',
  defaultVoice: 'default',
  defaultSpeed: 1.0,
  speedRange: {
    min: 0.5,
    max: 2.0,
    step: 0.1,
  },
  cacheMaxSize: 100, // 最大缓存数量
} as const;

// 主题配置
export const THEME_CONFIG = {
  colors: {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#13c2c2',
  },
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
} as const;

// 学习配置
export const STUDY_CONFIG = {
  dailyGoal: {
    words: 20,
    time: 30, // 分钟
  },
  difficulty: {
    easy: { color: '#52c41a', label: '简单' },
    medium: { color: '#faad14', label: '中等' },
    hard: { color: '#ff4d4f', label: '困难' },
  },
  reviewInterval: {
    easy: 7, // 天
    medium: 3,
    hard: 1,
  },
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  userSettings: 'user-settings',
  dictionaryStore: 'dictionary-store',
  appTheme: 'app-theme',
  lastVisit: 'last-visit',
  installPrompt: 'install-prompt-dismissed',
} as const;

// 路由路径
export const ROUTES = {
  home: '/',
  upload: '/upload',
  dictionary: '/dictionary',
  settings: '/settings',
  study: '/study',
  progress: '/progress',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  network: '网络连接失败，请检查网络设置',
  upload: {
    size: '文件大小超过限制，最大支持 10MB',
    type: '不支持的文件类型，请上传 PDF、TXT 或 DOCX 文件',
    failed: '文件上传失败，请重试',
  },
  speech: {
    generation: '语音生成失败，请重试',
    playback: '音频播放失败，请检查音频文件',
  },
  api: {
    timeout: '请求超时，请重试',
    server: '服务器错误，请稍后重试',
    notFound: '请求的资源不存在',
  },
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  upload: '文件上传成功',
  textProcessed: '文本处理完成',
  wordAdded: '单词已添加到词典',
  wordRemoved: '单词已从词典中移除',
  settingsSaved: '设置已保存',
  copied: '已复制到剪贴板',
} as const;

// 默认提示文本
export const PLACEHOLDER_TEXT = {
  search: '搜索单词...',
  uploadFile: '拖拽文件到此处或点击上传',
  noData: '暂无数据',
  loading: '加载中...',
  processing: '处理中...',
} as const;

// 正则表达式
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  word: /^[a-zA-Z]+$/,
  phoneNumber: /^1[3-9]\d{9}$/,
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;