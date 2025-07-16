import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DictionaryEntry, StudyProgress } from '@/types';

interface DictionaryStore {
  // 状态
  words: DictionaryEntry[];
  studyProgress: StudyProgress;
  searchQuery: string;
  filterDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  filterMarked: boolean;

  // 词典操作
  addWord: (word: Omit<DictionaryEntry, 'id' | 'addedTime' | 'reviewCount' | 'isMarked'>) => void;
  removeWord: (wordId: string) => void;
  updateWord: (wordId: string, updates: Partial<DictionaryEntry>) => void;
  markWord: (wordId: string, marked: boolean) => void;
  reviewWord: (wordId: string) => void;
  
  // 搜索和过滤
  setSearchQuery: (query: string) => void;
  setFilterDifficulty: (difficulty: 'all' | 'easy' | 'medium' | 'hard') => void;
  setFilterMarked: (marked: boolean) => void;
  getFilteredWords: () => DictionaryEntry[];
  
  // 学习进度
  updateStudyProgress: (updates: Partial<StudyProgress>) => void;
  incrementStudyTime: (minutes: number) => void;
  updateStreak: () => void;
  
  // 工具方法
  findWordByText: (word: string) => DictionaryEntry | undefined;
  getWordsByDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => DictionaryEntry[];
  clearDictionary: () => void;
}

const initialProgress: StudyProgress = {
  totalWords: 0,
  learnedWords: 0,
  reviewedWords: 0,
  studyTime: 0,
  lastStudyTime: '',
  streak: 0,
};

export const useDictionaryStore = create<DictionaryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        words: [],
        studyProgress: initialProgress,
        searchQuery: '',
        filterDifficulty: 'all',
        filterMarked: false,

        // 词典操作
        addWord: (wordData) => {
          const newWord: DictionaryEntry = {
            ...wordData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            addedTime: new Date().toISOString(),
            reviewCount: 0,
            isMarked: false,
          };

          set((state) => ({
            words: [...state.words, newWord],
            studyProgress: {
              ...state.studyProgress,
              totalWords: state.words.length + 1,
            },
          }), false, 'addWord');
        },

        removeWord: (wordId: string) => {
          set((state) => {
            const filteredWords = state.words.filter(word => word.id !== wordId);
            return {
              words: filteredWords,
              studyProgress: {
                ...state.studyProgress,
                totalWords: filteredWords.length,
              },
            };
          }, false, 'removeWord');
        },

        updateWord: (wordId: string, updates: Partial<DictionaryEntry>) => {
          set((state) => ({
            words: state.words.map(word =>
              word.id === wordId ? { ...word, ...updates } : word
            ),
          }), false, 'updateWord');
        },

        markWord: (wordId: string, marked: boolean) => {
          get().updateWord(wordId, { isMarked: marked });
        },

        reviewWord: (wordId: string) => {
          const now = new Date().toISOString();
          set((state) => {
            const updatedWords = state.words.map(word =>
              word.id === wordId
                ? {
                    ...word,
                    reviewCount: word.reviewCount + 1,
                    lastReviewed: now,
                  }
                : word
            );

            return {
              words: updatedWords,
              studyProgress: {
                ...state.studyProgress,
                reviewedWords: state.studyProgress.reviewedWords + 1,
              },
            };
          }, false, 'reviewWord');
        },

        // 搜索和过滤
        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, 'setSearchQuery');
        },

        setFilterDifficulty: (difficulty: 'all' | 'easy' | 'medium' | 'hard') => {
          set({ filterDifficulty: difficulty }, false, 'setFilterDifficulty');
        },

        setFilterMarked: (marked: boolean) => {
          set({ filterMarked: marked }, false, 'setFilterMarked');
        },

        getFilteredWords: () => {
          const { words, searchQuery, filterDifficulty, filterMarked } = get();
          
          return words.filter(word => {
            // 搜索过滤
            if (searchQuery && !word.word.toLowerCase().includes(searchQuery.toLowerCase())) {
              return false;
            }
            
            // 难度过滤
            if (filterDifficulty !== 'all' && word.difficulty !== filterDifficulty) {
              return false;
            }
            
            // 标记过滤
            if (filterMarked && !word.isMarked) {
              return false;
            }
            
            return true;
          });
        },

        // 学习进度
        updateStudyProgress: (updates: Partial<StudyProgress>) => {
          set((state) => ({
            studyProgress: { ...state.studyProgress, ...updates },
          }), false, 'updateStudyProgress');
        },

        incrementStudyTime: (minutes: number) => {
          set((state) => ({
            studyProgress: {
              ...state.studyProgress,
              studyTime: state.studyProgress.studyTime + minutes,
              lastStudyTime: new Date().toISOString(),
            },
          }), false, 'incrementStudyTime');
        },

        updateStreak: () => {
          const now = new Date();
          const today = now.toDateString();
          
          set((state) => {
            const lastStudy = state.studyProgress.lastStudyTime 
              ? new Date(state.studyProgress.lastStudyTime).toDateString()
              : '';
            
            let newStreak = state.studyProgress.streak;
            
            if (lastStudy !== today) {
              // 如果今天还没学习过
              const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
              
              if (lastStudy === yesterday) {
                // 连续学习
                newStreak += 1;
              } else if (lastStudy !== '') {
                // 中断了连续学习
                newStreak = 1;
              } else {
                // 第一次学习
                newStreak = 1;
              }
            }
            
            return {
              studyProgress: {
                ...state.studyProgress,
                streak: newStreak,
                lastStudyTime: now.toISOString(),
              },
            };
          }, false, 'updateStreak');
        },

        // 工具方法
        findWordByText: (word: string) => {
          return get().words.find(w => w.word.toLowerCase() === word.toLowerCase());
        },

        getWordsByDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => {
          return get().words.filter(word => word.difficulty === difficulty);
        },

        clearDictionary: () => {
          set({
            words: [],
            studyProgress: initialProgress,
          }, false, 'clearDictionary');
        },
      }),
      {
        name: 'dictionary-store',
        version: 1,
      }
    ),
    {
      name: 'dictionary-store',
    }
  )
);

// 选择器函数
export const selectWords = (state: DictionaryStore) => state.words;
export const selectStudyProgress = (state: DictionaryStore) => state.studyProgress;
export const selectSearchQuery = (state: DictionaryStore) => state.searchQuery;
export const selectFilterDifficulty = (state: DictionaryStore) => state.filterDifficulty;
export const selectFilterMarked = (state: DictionaryStore) => state.filterMarked;