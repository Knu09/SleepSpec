import { Link } from "expo-router";
import { useState, useEffect, useReducer, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { Audio } from "expo-av";
import { useLangStore } from "@/store/store";
import axios from 'axios'

const RecorderImage = require("@/assets/images/recording-button.png");
const FlagPH = require("@/assets/images/flag-ph.svg");

type Timer = {
    secs: number;
    mins: number;
};

interface RecordingState {
    timer: Timer;
    isRecording: boolean;
}

enum RecordAction {
    START,
    STOP,
    INCREMENT_TIMER,
}

const recordReducer = (
    state: RecordingState,
    action: RecordAction,
): RecordingState => {
    switch (action) {
        case RecordAction.START:
            return { ...state, isRecording: true };

        case RecordAction.STOP:
            return {
                ...state,
                timer: { secs: 0, mins: 0 },
                isRecording: false,
            };

        case RecordAction.INCREMENT_TIMER:
            const {
                timer: { secs, mins },
            } = state;
            const newSecs = secs + 1;
            const newMins = mins + Math.floor(newSecs / 60);

            return {
                ...state,
                timer: {
                    secs: newSecs % 60,
                    mins: newMins,
                },
            };
    }
};

const initialRecordState: RecordingState = {
    timer: {
        secs: 0,
        mins: 0,
    },
    isRecording: false,
};

export default function Recording() {
    const [recordState, dispatch] = useReducer(recordReducer, initialRecordState);
    const [index, setIndex] = useState(-1);
    const indexRef = useRef<NodeJS.Timeout>();
    const timerRef = useRef<NodeJS.Timeout>();
    const [recording, setRecording] = useState<Audio.Recording>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const language = useLangStore((state) => state.currentLang);
    const script = language.split(" ");

    useEffect(() => {
        // remove intervals when component unmounts
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (indexRef.current) clearInterval(indexRef.current);
        };
    }, []);

    async function recordStart() {
        if (recordState.isRecording) {
            return;
        }

        dispatch(RecordAction.START);
        const timerInterval = setInterval(() => {
            dispatch(RecordAction.INCREMENT_TIMER);
        }, 1000);

        const indexInterval = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 650);

        timerRef.current = timerInterval;
        indexRef.current = indexInterval;

        try {
            if (permissionResponse!.status !== "granted") {
                console.log("Requesting permission..");
                await requestPermission();
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log("Starting recording..");
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
            );
            setRecording(recording);
            console.log("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function recordStop() {
        if (!recordState.isRecording || !recording) {
            return;
        }

        dispatch(RecordAction.STOP);
        setIndex(-1);
        clearInterval(timerRef.current);
        clearInterval(indexRef.current);

        console.log("Stopping recording..");
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);

        uploadAudio(uri!);
    }

    return (
        <View className="bg-[#01000f]" style={{ flex: 1 }}>
            <View className="px-[26px] py-8 gap-2">
                <Text className="text-lg text-white font-medium">Language</Text>
                <Link href="/recording">
                    <View className="flex flex-row text gap-[9px] pl-[2px]">
                        <Image source={FlagPH} style={{ width: 25, aspectRatio: 1 }} />
                        <Text className="text-lg text-white font-normal">Filipino</Text>
                    </View>
                </Link>
            </View>
            <Text
                className="mx-8 h-[350px] text-lg leading-6 overflow-y-hidden
                text-[#ddd] font-light border-2 rounded-lg border-blue-800 p-2"
            >
                {script.map((text, i) => {
                    const highlight = "font-medium text-[#006fff]";
                    return (
                        <Text key={text + i} className={i <= index ? highlight : ""}>
                            {text}{" "}
                        </Text>
                    );
                })}
            </Text>

            <Text className="text-white mx-auto mt-10 text-3xl">
                {formatTime(recordState.timer)}
            </Text>
            <Pressable onPress={recordState.isRecording ? recordStop : recordStart}>
                <Image
                    source={RecorderImage}
                    style={{
                        width: 200,
                        aspectRatio: 1,
                        marginInline: "auto",
                        marginBlock: 18,
                    }}
                />
            </Pressable>
            <Text className="text-[#006fff] text-[24px] text-3xl font-medium mx-auto">
                {recordState.isRecording ? "Speak Now" : "Press to Record"}
            </Text>
        </View>
    );
}

async function uploadAudio(audioUri: string): Promise<string | void> {
    const formData = new FormData();
    formData.append("audio", {
        uri: audioUri,
        name: "recording.m4a", // or .m4a depending on your settings
        type: "audio/m4a", // or audio/m4a
    } as any);

    const env = process.env.EXPO_PUBLIC_ENV
    let api = (env == 'PROD') ? "http://10.0.2.2:5000" : process.env.EXPO_PUBLIC_API_URL;
    console.log(env)
    try {
        const response = await axios.post(`${api}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Upload failed", error);
    }
}

function formatTime({ secs, mins }: Timer): string {
    const formattedMinutes = String(mins).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");
    // const formattedMilliseconds = String(millis).slice(0, 1);

    return `${formattedMinutes}:${formattedSeconds}`;
}
