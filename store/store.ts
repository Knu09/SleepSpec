import { create } from "zustand";
import { ClassResult, LANG } from "@/types/types";
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

export type Segment = {
    id: number;
    uri: string;
};

type SegmentStore = {
    pendingSegments: Promise<Segment[]>;
    syncSegments: () => void;
};

export const useLangStore = create<LangStore>((set) => ({
    currentLang: LANG.ENGLISH,
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

        const fetchSegments = async (): Promise<Segment[]> => {
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
                        const cut = "file://".length
                        const audiopath = file.uri.substring(cut)
                        return { id: i + 1, uri: audiopath }
                    });
            } catch (error) {
                console.error("Error:", error);
            }

            return [];
        };

        set({ pendingSegments: fetchSegments() });
    },
}));
