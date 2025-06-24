import { fetch } from "expo/fetch";
import { File } from "expo-file-system/next";
import { Link, useFocusEffect } from "expo-router";
import {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AudioModule, useAudioRecorder } from "expo-audio";

import { useClassStore, useLangStore, useSegmentStore } from "@/store/store";
import CustomRCPreset from "@/constants/rc_option";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";

import Header from "@/components/Header";
import LanguageSelected from "@/components/LanguageSelected";
import { Timer, CLASS, LANG, Process } from "@/types/types";
import Overlay from "@/components/Overlay";
import { ThemeContext } from "@/context/ThemeContext";

type RecordingState = {
    timer: Timer;
    isRecording: boolean;
    isPaused: boolean;
};

enum RecordAction {
    START,
    STOP,
    INCREMENT_TIMER,
    PAUSE,
    RESUME,
}

const recordReducer = (
    state: RecordingState,
    action: RecordAction,
): RecordingState => {
    switch (action) {
        case RecordAction.START:
            return { ...state, isRecording: true, isPaused: false };

        case RecordAction.STOP:
            return {
                ...state,
                timer: Timer.reset(),
                isRecording: false,
            };
        case RecordAction.PAUSE:
            return { ...state, isPaused: true };

        case RecordAction.RESUME:
            return { ...state, isPaused: false };

        case RecordAction.INCREMENT_TIMER:
            const {
                timer: { secs, mins },
            } = state;

            return {
                ...state,
                timer: Timer.fromSeconds(secs + 1 + mins * 60),
            };
    }
};

const initialRecordState: RecordingState = {
    timer: Timer.reset(),
    isRecording: false,
    isPaused: false,
};

export default function Recording() {
    const [recordState, dispatch] = useReducer(
        recordReducer,
        initialRecordState,
    );
    const timerRef = useRef<number>(0);
    const audioRecorder = useAudioRecorder(CustomRCPreset);
    const { currentLang: lang } = useLangStore();
    const [upload, setUpload] = useState(Process.IDLE);
    const { result, setResult } = useClassStore();
    const { syncSegments } = useSegmentStore();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const micColor = isDark ? "#FFF" : "000";

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

        timerRef.current = setInterval(() => {
            dispatch(RecordAction.INCREMENT_TIMER);
        }, 1000);
    }

    async function recordPause() {
        dispatch(RecordAction.PAUSE);
        clearInterval(timerRef.current);
        await audioRecorder.pause();
    }

    async function recordResume() {
        dispatch(RecordAction.RESUME);
        await audioRecorder.record();

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            dispatch(RecordAction.INCREMENT_TIMER);
        }, 1000);
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

        setResult(CLASS.from(result));
        syncSegments();
    }

    return (
        <SafeAreaView className={bgClass} style={{ flex: 1 }}>
            <Header title={"Recording"} back={true} menu={true} />
            <ScrollView className="flex my-5 px-3">
                <View
                    style={{ elevation: 3 }}
                    className={
                        (isDark ? "bg-transparent" : "bg-white") +
                        " px-5 py-3 rounded-3xl gap-4"
                    }
                >
                    <View className="gap-1">
                        <Text
                            className={
                                textClass + " text-lg font-bold font-publicsans"
                            }
                        >
                            Language Speech
                        </Text>
                        <Link href="/select_language" className="w-28">
                            <LanguageSelected />
                        </Link>
                    </View>
                    <View className="bg-transparent">
                        <LinearGradient
                            colors={["#006EFF", "#7800D3"]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="flex justify-center items-center"
                            style={{
                                borderRadius: 15,
                            }}
                        >
                            <View className=" rounded-[15px] m-[1px] bg-darkBg relative overflow-hidden">
                                <ScrollView
                                    className="max-h-[340px] mx-6"
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text className=" text-lg leading-6 py-4 pb-10 text-secondary font-light text-ellipsis">
                                        {LANG.getScript(lang).content}
                                    </Text>
                                </ScrollView>
                                {/* Top Transparent Overlay */}
                                <LinearGradient
                                    colors={["rgba(0,0,0,.5)", "transparent"]}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 30,
                                    }}
                                    pointerEvents="none"
                                />

                                {/* Bottom Dark Fade */}
                                <LinearGradient
                                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 100,
                                    }}
                                    pointerEvents="none"
                                />
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View className="mt-5">
                    <Text
                        className={
                            textClass +
                            " mx-auto text-3xl font-bold font-poppins"
                        }
                    >
                        {Timer.format(recordState.timer)}
                    </Text>
                    <View className="flex justify-center items-center my-3">
                        <Pressable
                            onPress={() => {
                                if (
                                    recordState.isRecording &&
                                    !recordState.isPaused
                                ) {
                                    recordPause();
                                } else if (
                                    recordState.isRecording &&
                                    recordState.isPaused
                                ) {
                                    recordResume();
                                } else {
                                    recordStart();
                                }
                            }}
                            onLongPress={() => {
                                if (recordState.isRecording) {
                                    recordStop(true);
                                    setUpload(Process.PENDING);
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
                                        color={
                                            recordState.isRecording
                                                ? recordState.isPaused
                                                    ? "#FFF"
                                                    : "#006fff"
                                                : "#FFF"
                                        }
                                    />
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <View className="text-center gap-2">
                        <Text
                            className={`text-xl font-bold mx-auto font-publicsans ${
                                recordState.isRecording
                                    ? recordState.isPaused
                                        ? textClass
                                        : "text-primaryBlue"
                                    : textClass
                            }`}
                        >
                            {recordState.isRecording
                                ? recordState.isPaused
                                    ? "Paused"
                                    : "Recording"
                                : "Press to Record"}
                        </Text>
                        <Text
                            className={
                                textClass +
                                " text-center text-sm font-regular font-publicsans"
                            }
                        >
                            {recordState.isRecording ? (
                                recordState.isPaused ? (
                                    <Text
                                        className={
                                            textClass + " text-center mt-4"
                                        }
                                    >
                                        Tap{" "}
                                        <Icon
                                            name="microphone"
                                            size={16}
                                            color={micColor}
                                        />{" "}
                                        to Resume Recording
                                    </Text>
                                ) : (
                                    <Text
                                        className={
                                            textClass + " text-center mt-4"
                                        }
                                    >
                                        Hold{" "}
                                        <Icon
                                            name="microphone"
                                            size={16}
                                            color="#006FFF"
                                        />{" "}
                                        to Stop Recording
                                    </Text>
                                )
                            ) : (
                                <Text
                                    className={textClass + " text-center mt-4"}
                                >
                                    Tap{" "}
                                    <Icon
                                        name="microphone"
                                        size={16}
                                        color={micColor}
                                    />{" "}
                                    to Start Recording
                                </Text>
                            )}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <Overlay
                heading="Processing Audio Data"
                state={upload}
                redirect="/analysis"
            />
        </SafeAreaView>
    );
}

async function uploadAudio(audioUri: string): Promise<{
    class: string;
    confidence_score: number;
    classes: string[];
    scores: number[];
    sd_prob: number;
    nsd_prob: number;
    decision_score: number;
} | void> {
    if (process.env.EXPO_PUBLIC_SERVER == "NO") {
        // return mock result
        return {
            class: "post",
            classes: ["post"],
            scores: [0.56],
            sd_prob: 0,
            nsd_prob: 0,
            confidence_score: 0.56,
            decision_score: 1.2345,
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

const styles = StyleSheet.create({
    linearGradientMicrophone: {
        borderRadius: 100,
    },
});
