import { create } from 'zustand';
import type Lang from '@/constants/speech_scripts'

export const useLangStore = create((set) => ({
    currentLang: undefined,
    setCurrentLang: (language: Lang) => set({ currentLang: language }),
}));
