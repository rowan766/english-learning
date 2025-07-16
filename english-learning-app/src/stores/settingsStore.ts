import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserSettings, AppTheme } from '@/types';

interface SettingsStore extends UserSettings {
  // 设置更新方法
  setLanguage: (language: 'en' | 'zh') => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setSpeechSpeed: (speed: number) => void;
  setVoiceType: (voice: string) => void;
  setTheme: (theme: AppTheme) => void;
  
  // 复合操作
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  language: 'en',
  autoPlay: false,
  speechSpeed: 1.0,
  voiceType: 'default',
  theme: {
    mode: 'light',
    primaryColor: '#1677ff',
  },
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultSettings,

        // 基础设置更新方法
        setLanguage: (language: 'en' | 'zh') => {
          set({ language }, false, 'setLanguage');
        },

        setAutoPlay: (autoPlay: boolean) => {
          set({ autoPlay }, false, 'setAutoPlay');
        },

        setSpeechSpeed: (speed: number) => {
          // 限制语速范围 0.5 - 2.0
          const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
          set({ speechSpeed: clampedSpeed }, false, 'setSpeechSpeed');
        },

        setVoiceType: (voice: string) => {
          set({ voiceType: voice }, false, 'setVoiceType');
        },

        setTheme: (theme: AppTheme) => {
          set({ theme }, false, 'setTheme');
        },

        // 复合操作
        updateSettings: (settings: Partial<UserSettings>) => {
          set((state) => ({
            ...state,
            ...settings,
          }), false, 'updateSettings');
        },

        resetSettings: () => {
          set(defaultSettings, false, 'resetSettings');
        },
      }),
      {
        name: 'user-settings', // localStorage中的键名
        version: 1, // 版本号，用于迁移
        migrate: (persistedState: any, version: number) => {
          // 处理版本迁移
          if (version === 0) {
            // 从版本0迁移到版本1的逻辑
            return {
              ...defaultSettings,
              ...persistedState,
            };
          }
          return persistedState;
        },
      }
    ),
    {
      name: 'settings-store',
    }
  )
);

// 选择器函数
export const selectLanguage = (state: SettingsStore) => state.language;
export const selectAutoPlay = (state: SettingsStore) => state.autoPlay;
export const selectSpeechSpeed = (state: SettingsStore) => state.speechSpeed;
export const selectVoiceType = (state: SettingsStore) => state.voiceType;
export const selectTheme = (state: SettingsStore) => state.theme;