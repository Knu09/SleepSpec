import { create } from 'zustand';
import Lang from '@/constants/speech_scripts'

type LangStore = {
    currentLang: Lang;
    setCurrentLang: (language: Lang) => void;
}

export const useLangStore = create<LangStore>((set) => ({
    currentLang: Lang.LOREM,
    setCurrentLang: (language: Lang) => set({ currentLang: language }),
}));
