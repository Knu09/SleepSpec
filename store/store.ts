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
    decision_score: number;
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
                    .map((file) => {
                        // remove 'file://' substring
                        const cut = "file://".length;
                        const audiopath = file.uri.substring(cut);

                        const prefix = "segment_".length;
                        const ext = file.name.search(".wav");
                        const id = parseInt(file.name.substring(prefix, ext));

                        return { id, uri: audiopath };
                    });
            } catch (error) {
                console.error("Error:", error);
            }

            return [];
        };

        set({ pendingSegments: fetchSegments() });
    },
    syncResultsFrom: ({ classes, scores, decision_scores }, segments) => {
        if (
            classes.length != scores.length ||
            segments.length !== classes.length
        ) {
            console.error("Mismatch in segments/classes/scores lengths!");
            return [];
        }

        const sortedSegments = [...segments].sort((a, b) => a.id - b.id);

        return sortedSegments.map((segment, i) => ({
            ...segment,
            class: classes[i],
            confidence_score: scores[i],
            decision_score: decision_scores[i],
        }));
    },
}));
