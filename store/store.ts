import { create } from "zustand";
import { LANG } from "@/types/types";

type LangStore = {
    currentLang: LANG;
    setCurrentLang: (language: LANG) => void;
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: LANG.ENGLISH,
    setCurrentLang: (language: LANG) => set({ currentLang: language }),
}));
