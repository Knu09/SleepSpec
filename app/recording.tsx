import { fetch } from "expo/fetch";
import { File } from "expo-file-system/next";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AudioModule, useAudioRecorder } from "expo-audio";

import { useClassStore, useLangStore } from "@/store/store";
import CustomRCPreset from "@/constants/rc_option";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";

import Header from "@/components/Header";
import LanguageSelected from "@/components/LanguageSelected";
import { CLASS, LANG, Process } from "@/types/types";
import Overlay from "@/components/Overlay";

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
    const timerRef = useRef<number>(0);
    const audioRecorder = useAudioRecorder(CustomRCPreset);
    const { currentLang: lang } = useLangStore();
    const [upload, setUpload] = useState(Process.IDLE);
    const { result, setResult } = useClassStore();

    useEffect(() => {
        // request recording permissions
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission to access microphone was denied");
            }
        })();

        // remove interval when component unmounts
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Cleanup when this page goes out of focus
                recordStop(false);
            };
        }, [audioRecorder]),
    );

    async function recordStart() {
        if (recordState.isRecording) {
            return;
        }

        dispatch(RecordAction.START);

        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();

        const timerInterval = setInterval(() => {
            dispatch(RecordAction.INCREMENT_TIMER);
        }, 1000);

        timerRef.current = timerInterval;
    }

    async function recordStop(upload: boolean) {
        if (!recordState.isRecording) return;

        dispatch(RecordAction.STOP);
        clearInterval(timerRef.current);

        await audioRecorder.stop();

        // Skip upload when specified
        if (!upload) return;

        const uri = audioRecorder.uri;
        const result = await uploadAudio(uri!);

        if (!result) {
            setUpload(Process.FAILED);
            return;
        }

        console.log(result);
        setUpload(Process.READY);

        setResult(CLASS.fromJSON(result));
    }

    return (
        <SafeAreaView className="bg-darkBg" style={{ flex: 1 }}>
            <Header title={"Recording"} back={true} menu={true} />
            <ScrollView className="flex gap-4 mt-10 px-6">
                <View className="gap-2">
                    <Text className="text-lg text-white font-medium">
                        Language
                    </Text>
                    <Link href="/select_language" className="w-28">
                        <LanguageSelected />
                    </Link>
                </View>
                <View className="py-6">
                    <ScrollView
                        className="max-h-[350px] pb-6 border-2 rounded-lg border-blue-800 p-4"
                        nestedScrollEnabled={true}
                    >
                        <Text className=" text-lg leading-6 text-secondary font-light text-ellipsis">
                            {LANG.getScript(lang)}
                        </Text>
                    </ScrollView>
                </View>

                <Text className="text-white mx-auto text-3xl">
                    {formatTime(recordState.timer)}
                </Text>
                <View className="flex justify-center items-center my-5">
                    <Pressable
                        onPress={() => {
                            if (recordState.isRecording) {
                                recordStop(true);
                                setUpload(Process.PENDING);
                            } else {
                                recordStart();
                            }
                        }}
                    >
                        <LinearGradient
                            colors={["#006EFF", "#7800D3"]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="justify-center items-center p-[2px]"
                            style={styles.linearGradientMicrophone}
                        >
                            <View className="w-40 h-40 flex justify-center items-center bg-[#01000F] rounded-full">
                                <Icon
                                    name="microphone"
                                    size={60}
                                    color={recordState.isRecording
                                        ? "#006fff"
                                        : "#FFF"}
                                />
                            </View>
                        </LinearGradient>
                    </Pressable>
                </View>

                <Text
                    className={`text-2xl font-medium mx-auto ${
                        recordState.isRecording
                            ? "text-primaryBlue"
                            : "text-white"
                    }`}
                >
                    {recordState.isRecording ? "Speak Now" : "Press to Record"}
                </Text>

                {result && ( // only show link when results are ready
                    <Link
                        href="/analysis"
                        className="text-secondary font-medium mt-12"
                    >
                        <Text className="text-right">View Results</Text>
                    </Link>
                )}
            </ScrollView>

            <Overlay heading="Pre - processing" state={upload} redirect='/analysis' />
        </SafeAreaView>
    );
}

async function uploadAudio(audioUri: string): Promise<
    {
        class: number;
        confidence_score: number;
    } | void
> {
    if (process.env.EXPO_PUBLIC_SERVER == "NO") {
        // return mock result
        return {
            class: 1,
            confidence_score: 0.56,
        };
    }

    const file = new File(audioUri);
    const formData = new FormData();
    formData.append("audio", file.blob(), "recording.m4a");

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

        const response = await fetch(`${api}/upload`, {
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

function formatTime({ secs, mins }: Timer): string {
    const formattedMinutes = String(mins).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

const styles = StyleSheet.create({
    linearGradientMicrophone: {
        borderRadius: 100,
    },
});
