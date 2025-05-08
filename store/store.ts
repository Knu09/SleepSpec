import { create } from "zustand";
import { ClassResult, LANG } from "@/types/types";

type LangStore = {
    currentLang: LANG;
    setCurrentLang: (language: LANG) => void;
};

type ClassStore = {
    result?: ClassResult;
    setResult: (cr: ClassResult) => void;
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: LANG.ENGLISH,
    setCurrentLang: (language: LANG) => set({ currentLang: language }),
}));

export const useClassStore = create<ClassStore>((set) => ({
    setResult: (cr: ClassResult) => set({ result: cr }),
}));
