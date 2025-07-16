// 导出所有状态管理相关的内容

// 应用主状态
export {
  useAppStore,
  selectLoading,
  selectError,
  selectCurrentDocument,
  selectCurrentText,
  selectIsPlaying,
  selectCurrentAudioUrl,
} from './appStore';

// 用户设置状态
export {
  useSettingsStore,
  selectLanguage,
  selectAutoPlay,
  selectSpeechSpeed,
  selectVoiceType,
  selectTheme,
} from './settingsStore';

// 词典管理状态
export {
  useDictionaryStore,
  selectWords,
  selectStudyProgress,
  selectSearchQuery,
  selectFilterDifficulty,
  selectFilterMarked,
} from './dictionaryStore';