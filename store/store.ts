import { create } from "zustand";
import Advice, { adviceList, AdviceType } from "@/constants/analysis_advice";
import { LANG } from "@/types/types";

type LangStore = {
    currentLang: LANG;
    setCurrentLang: (language: LANG) => void;
};

type AdviceStore = {
    currentAdvice: AdviceType;
    adviceRecommendations: (typeof adviceList)[AdviceType];
    setCurrentAdvice: (advice: AdviceType) => void;
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: LANG.ENGLISH,
    setCurrentLang: (language: LANG) => set({ currentLang: language }),
}));

export const useAdviceStore = create<AdviceStore>((set) => ({
    currentAdvice: "HIGHLY",
    adviceRecommendations: adviceList.HIGHLY,
    setCurrentAdvice: (advice: AdviceType) =>
        set({
            currentAdvice: advice,
            adviceRecommendations: adviceList[advice],
        }),
}));
