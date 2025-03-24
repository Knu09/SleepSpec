import { create } from "zustand";
import Lang from "@/constants/speech_scripts";
import Advice, { AdviceType, adviceList } from "@/constants/analysis_advice";

type LangStore = {
    currentLang: Lang;
    setCurrentLang: (language: Lang) => void;
};

type AdviceStore = {
    currentAdvice: AdviceType;
    adviceRecommendations: (typeof adviceList)[AdviceType];
    setCurrentAdvice: (advice: AdviceType) => void;
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: Lang.FILIPINO,
    setCurrentLang: (language: Lang) => set({ currentLang: language }),
}));

export const useAdviceStore = create<AdviceStore>((set) => ({
    currentAdvice: "HIGHLY",
    adviceRecommendations: adviceList["HIGHLY"],
    setCurrentAdvice: (advice: AdviceType) =>
        set({
            currentAdvice: advice,
            adviceRecommendations: adviceList[advice],
        }),
}));
