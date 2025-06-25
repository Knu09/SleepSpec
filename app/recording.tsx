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
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";

import Header from "@/components/Header";
import LanguageSelected from "@/components/LanguageSelected";
import { Timer, CLASS, LANG, Process } from "@/types/types";
import Overlay from "@/components/Overlay";
import { ThemeContext } from "@/context/ThemeContext";
import GradientIcon from "@/components/GradientIcon";

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
    const micColor = "#006FFF";
    const bottomGradient = isDark ? "#01000F" : "#FFF";

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
        <SafeAreaView className={bgClass} style={styles.container}>
            <Header title={"Recording"} back={true} menu={true} />
            <View className="my-5 px-3 flex-1">
                <View
                    style={{ elevation: 3 }}
                    className={
                        (isDark ? "bg-transparent" : "bg-white") +
                        " px-4 py-3 rounded-3xl gap-4"
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
                                borderRadius: 12,
                                padding: 2,
                            }}
                        >
                            <View
                                className={
                                    (isDark ? "bg-darkBg" : "bg-white") +
                                    " rounded-[10px] relative overflow-hidden"
                                }
                            >
                                <View>
                                    <ScrollView
                                        className="max-h-[310px] px-4"
                                        nestedScrollEnabled={true}
                                    >
                                        <Text
                                            className={
                                                textClass +
                                                " text-[16px] leading-7 py-4 pb-10 font-publicsansLight"
                                            }
                                        >
                                            {LANG.getScript(lang).content}
                                        </Text>
                                    </ScrollView>

                                    <LinearGradient
                                        colors={["transparent", bottomGradient]}
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: 80,
                                        }}
                                        pointerEvents="none"
                                    />
                                </View>

                                <View
                                    className={
                                        (isDark ? "bg-darkBg" : "bg-white") +
                                        " mx-4 py-3 border-primary border-t-[1.5px]"
                                    }
                                >
                                    <Text
                                        className={
                                            textClass +
                                            " text-start font-publicsans"
                                        }
                                    >
                                        {recordState.isRecording ? (
                                            recordState.isPaused ? (
                                                <Text
                                                    className={
                                                        textClass +
                                                        " text-start mt-4"
                                                    }
                                                >
                                                    Tap{"  "}
                                                    <Icon
                                                        name="microphone"
                                                        size={16}
                                                        color={micColor}
                                                    />
                                                    {"  "}
                                                    to Resume Recording
                                                </Text>
                                            ) : (
                                                <View className="flex-row justify-center items-center">
                                                    <Text
                                                        className={
                                                            textClass +
                                                            " font-publicsans text-center"
                                                        }
                                                    >
                                                        Hold
                                                    </Text>
                                                    <MaskedView
                                                        maskElement={
                                                            <View className="justify-center items-center">
                                                                <Icon
                                                                    name="microphone"
                                                                    size={16}
                                                                    color="black"
                                                                />
                                                            </View>
                                                        }
                                                    >
                                                        <LinearGradient
                                                            colors={[
                                                                "#006FFF",
                                                                "#7800D3",
                                                            ]}
                                                            start={{
                                                                x: 0.5,
                                                                y: 0,
                                                            }}
                                                            end={{
                                                                x: 0.5,
                                                                y: 1,
                                                            }}
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                marginHorizontal: 2,
                                                            }}
                                                        />
                                                    </MaskedView>
                                                    <Text
                                                        className={
                                                            textClass +
                                                            " font-publicsans text-center"
                                                        }
                                                    >
                                                        to Stop Recording
                                                    </Text>
                                                </View>
                                            )
                                        ) : (
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-start mt-4"
                                                }
                                            >
                                                Tap{"  "}
                                                <Icon
                                                    name="microphone"
                                                    size={16}
                                                    color={micColor}
                                                />
                                                {"  "}
                                                to Start Recording
                                            </Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View className="flex flex-col flex-1 justify-center">
                    <View className="">
                        <Text
                            className={
                                textClass +
                                " mx-auto text-3xl font-normal font-poppins"
                            }
                        >
                            {Timer.format(recordState.timer)}
                        </Text>
                    </View>
                    <View className="flex justify-center items-center mb-2 mt-2">
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
                                <View
                                    className={
                                        (isDark ? "bg-darkBg" : "bg-white") +
                                        " w-40 h-40 flex justify-center items-center rounded-full"
                                    }
                                    style={styles.shadowProp}
                                >
                                    {recordState.isRecording &&
                                    !recordState.isPaused ? (
                                        <GradientIcon
                                            name="microphone"
                                            size={60}
                                        />
                                    ) : (
                                        <Icon
                                            name="microphone"
                                            size={60}
                                            color="#006fff"
                                        />
                                    )}
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
                                        Tap{"  "}
                                        <Icon
                                            name="microphone"
                                            size={16}
                                            color={micColor}
                                        />
                                        {"  "}
                                        to Resume Recording
                                    </Text>
                                ) : (
                                    <View className="flex-row justify-center items-center mt-4">
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-publicsans"
                                            }
                                        >
                                            Hold
                                        </Text>
                                        <MaskedView
                                            maskElement={
                                                <View className="justify-center items-center">
                                                    <Icon
                                                        name="microphone"
                                                        size={16}
                                                        color="black"
                                                    />
                                                </View>
                                            }
                                        >
                                            <LinearGradient
                                                colors={["#006FFF", "#7800D3"]}
                                                start={{ x: 0.5, y: 0 }}
                                                end={{ x: 0.5, y: 1 }}
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginHorizontal: 2,
                                                }}
                                            />
                                        </MaskedView>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-publicsans"
                                            }
                                        >
                                            to Stop Recording
                                        </Text>
                                    </View>
                                )
                            ) : (
                                <Text
                                    className={textClass + " text-center mt-4"}
                                >
                                    Tap{"  "}
                                    <Icon
                                        name="microphone"
                                        size={16}
                                        color={micColor}
                                    />
                                    {"  "}
                                    to Start Recording
                                </Text>
                            )}
                        </Text>
                    </View>
                </View>
            </View>

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

    shadowProp: {
        elevation: 10,
        shadowColor: "#000",
    },

    container: {
        alignItems: "center",
        flex: 1,
        // color: "white",
        textAlign: "center",
    },
});
