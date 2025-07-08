import { create } from "zustand";
import { CLASS, ClassResult, Evaluations, LANG } from "@/types/types";
import { Directory, File, Paths } from "expo-file-system/next";
import { unzip } from "react-native-zip-archive";

type LangStore = {
    currentLang: LANG;
    setCurrentLang: (language: LANG) => void;
};

type ClassStore = {
    result?: ClassResult;
    setResult: (cr: ClassResult) => void;
};

export type PendingSegment = {
    id: number;
    uri: string;
};

export type Segment = {
    id: number;
    uri: string;
    class: CLASS;
    confidence_score: number;
};

type SegmentStore = {
    pendingSegments: Promise<PendingSegment[]>;
    syncSegments: () => void;
    syncResultsFrom: (
        evals: Evaluations,
        segments: PendingSegment[],
    ) => Segment[];
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: LANG.ENG1,
    setCurrentLang: (language: LANG) => set({ currentLang: language }),
}));

export const useClassStore = create<ClassStore>((set) => ({
    setResult: (cr: ClassResult) => set({ result: cr }),
}));

export const useSegmentStore = create<SegmentStore>((set) => ({
    pendingSegments: Promise.resolve([]),
    syncSegments: () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/segments`;
        const dest = new Directory(Paths.cache, "segments");

        const fetchSegments = async (): Promise<PendingSegment[]> => {
            try {
                // delete old files
                if (dest.exists) dest.delete();

                dest.create();

                // download segments.zip
                const out = await File.downloadFileAsync(url, dest);

                if (!out.exists) {
                    console.error("Error downloading file!");
                }

                // unzip
                await unzip(out.uri, dest.uri);

                // delete segments.zip after extraction
                out.delete();

                return dest
                    .list()
                    .filter((entry) => entry instanceof File)
                    .map((file, i) => {
                        // remove 'file://' substring
                        const cut = "file://".length;
                        const audiopath = file.uri.substring(cut);
                        return { id: i + 1, uri: audiopath };
                    });
            } catch (error) {
                console.error("Error:", error);
            }

            return [];
        };

        set({ pendingSegments: fetchSegments() });
    },
    syncResultsFrom: ({ classes, scores }, segments) => {
        if (classes.length != scores.length) {
            console.error("Insufficient classes or scores received!");
            return [];
        }

        return segments
            .map((segment, i) => ({
                ...segment,
                class: classes[i],
                confidence_score: scores[i],
            }))
            .sort((a, b) => a.id - b.id);
    },
}));
