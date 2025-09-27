import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import getUUID from "@/store/uuid";
import { CLASS, ClassResult } from "@/types/types";

export async function uploadAudio(
    audioUri: string,
    noiseRemoval: boolean,
): Promise<ClassResult | void> {
    if (process.env.EXPO_PUBLIC_SERVER == "NO") {
        // return mock result
        return {
            class: CLASS.POST,
            classes: [CLASS.POST],
            scores: [0.56],
            sd_prob: 0,
            nsd_prob: 0,
            confidence_score: 0.56,
            decision_score: 1.2345,
            decision_scores: [1.2345],
        };
    }

    const file = new File(audioUri);
    const formData = new FormData();
    formData.append("audio", file, "recording.m4a");
    formData.append("noiseRemoval", noiseRemoval ? "true" : "false"); // send noise removal flag to server

    const env = process.env.EXPO_PUBLIC_DEVICE;

    let api;
    if (env == "PHYSICAL") {
        api = process.env.EXPO_PUBLIC_API_URL;
    } else if (env == "EMU") {
        api = "http://10.0.2.2:5000";
    } else {
        console.error(
            "Please set EXPO_PUBLIC_DEVICE value (PHYSICAL / EMU) in .env file!",
        );
    }

    try {
        console.log(env, api);
        const uid = await getUUID();

        const response = await fetch(`${api}/upload/${uid}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}, Response: ${response}`,
            );
        }

        const data = await response.json();
        console.log("Success:", data);

        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}
