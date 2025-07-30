import { fetch } from "expo/fetch";
import { File } from "expo-file-system/next";
import { Link, useFocusEffect, useRouter } from "expo-router";
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
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
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
import {
    AntDesign,
    Entypo,
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ToastMessage from "@/components/ToastMessage";
import type { ToastMessageProps } from "@/components/ToastMessage";
import Animated, {
    Extrapolate,
    Extrapolation,
    interpolate,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

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
    const timerRef = useRef<number | null>(null);
    const secondsRef = useRef<number>(0);
    const audioRecorder = useAudioRecorder(CustomRCPreset);
    const { currentLang: lang } = useLangStore();
    const [upload, setUpload] = useState(Process.IDLE);

    // Metering wavefom values
    const [currentMetering, setCurrentMetering] = useState(-60);
    const animatedMeter = useSharedValue(0);

    // console.log("Audio dB:", currentMetering);

    const { result, setResult } = useClassStore();
    const { syncSegments } = useSegmentStore();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const micColor = "#006FFF";
    const bottomGradient = isDark ? "#01000F" : "#FFF";
    const topStopColor = isDark ? "#006FFF" : "#595959";
    const bottomStopColor = isDark ? "#7800D3" : "#585858";
    const borderColorClass = isDark
        ? "border-primary border-t-[1px]"
        : "border-divider border-t-[1px]";
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";
    const iconColor = isDark ? "#FFF" : "#01000F";

    const router = useRouter();

    const toastMesRef = useRef<any>({});

    let hasShownToast = false;
    const toastFlags = {
        segment15s: false,
        segment1min: false,
    };

    function triggerToast({
        title,
        description,
        type,
        duration,
        iconName,
        iconFamily,
        delay = 500,
    }: ToastMessageProps) {
        toastMesRef.current?.hide?.();
        setTimeout(() => {
            toastMesRef.current?.show({
                title,
                description,
                type,
                duration,
                iconName,
                iconFamily,
            });
        }, delay);
    }

    const navigateTo = (screen: string) => {
        router.push(`/${screen}` as any);
    };

    // INFO: Modal useState
    const [modalVisible, setModalVisible] = useState(false);

    // INFO: Bullet Items Array for Current Status Instructions
    const statusInstructions = [
        {
            state: '"Tap ',
            bold: ' to Start Recording"',
            desc: " - Shown before the first recording begins",
        },
        {
            state: '"Hold ',
            bold: ' to Stop Recording"',
            desc: " - Instructs the user how to end the session while recording is active.",
        },
        {
            state: '"Tap ',
            bold: ' to Resume Recording"',
            desc: " - If the user has paused or stopped a previous session.",
        },
    ];

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

    // NOTE: Recording Metering Animation: this is used for real-time animation of metering in dB
    useEffect(() => {
        let animationFrameId: number;

        const updateMetering = async () => {
            try {
                const status = await audioRecorder.getStatus();
                if (status?.metering !== undefined) {
                    setCurrentMetering(status.metering);
                }
            } catch (error) {
                console.error("Error getting audio status:", error);
            }

            animationFrameId = requestAnimationFrame(updateMetering);
        };

        if (recordState.isRecording) {
            animationFrameId = requestAnimationFrame(updateMetering);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [recordState.isRecording]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Cleanup when this page goes out of focus
                recordStop(false);
            };
        }, [audioRecorder]),
    );

    function startTimerWithToasts() {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            dispatch(RecordAction.INCREMENT_TIMER);
            secondsRef.current += 1;

            if (secondsRef.current >= 15 && !toastFlags.segment15s) {
                toastFlags.segment15s = true;

                triggerToast({
                    title: "Segmentation",
                    description: "Recording exceeded 15 seconds.",
                    type: "info",
                    duration: 5000,
                    iconName: "info",
                    iconFamily: "Feather",
                    delay: 280,
                });
            }
            if (secondsRef.current % 60 == 0 && secondsRef.current <= 240) {
                toastFlags.segment1min = true;

                triggerToast({
                    title: "Segmentation",
                    description: `You've reached the ${secondsRef.current / 60}-minute mark. You may continue recording or stop now if ready.`,
                    type: "info",
                    duration: 5000,
                    iconName: "info",
                    iconFamily: "Feather",
                    delay: 280,
                });
            }
            if (secondsRef.current === 300) {
                clearInterval(timerRef.current!);
                recordStop(true);
            }
        }, 1000);
    }

    async function recordStart() {
        if (recordState.isRecording) {
            return;
        }

        dispatch(RecordAction.START);

        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();

        triggerToast({
            title: "Recording Started",
            description:
                "Please read the script clearly for at least 15 seconds.",
            type: "info",
            duration: 5000,
            iconName: "info",
            iconFamily: "Feather",
            delay: 270,
        });

        secondsRef.current = 0;
        toastFlags.segment15s = false;
        toastFlags.segment1min = false;

        startTimerWithToasts();
    }

    async function recordPause() {
        dispatch(RecordAction.PAUSE);
        // Reset the waveform size to 120
        setCurrentMetering(-158);
        await audioRecorder.pause();

        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        hasShownToast = true;

        triggerToast({
            title: "Recording Paused",
            description:
                "Press the microphone to resume recording or hold to stop the recording.",
            type: "warning",
            duration: 8000,
            iconName: "warning",
            iconFamily: "Ionicons",
            delay: 500,
        });
    }

    async function recordResume() {
        dispatch(RecordAction.RESUME);
        await audioRecorder.record();

        hasShownToast = true;

        triggerToast({
            title: "Recording Resumed",
            description: "Continue speaking clearly. Feel free to pause.",
            type: "info",
            duration: 5000,
            iconName: "info",
            iconFamily: "Feather",
            delay: 300,
        });
        hasShownToast = false;

        startTimerWithToasts();
    }

    async function recordStop(upload: boolean) {
        if (!recordState.isRecording) return;

        dispatch(RecordAction.STOP);
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        secondsRef.current = 0;

        await audioRecorder.stop();

        // Skip upload when specified
        if (!upload) return;

        triggerToast({
            title: "Audio Successfully Uploaded",
            description:
                "Please wait for a moment while the system is processing your audio data.",
            type: "success",
            duration: 10000,
            iconName: "checkmark-circle",
            iconFamily: "Ionicons",
            delay: 500,
        });

        hasShownToast = false;

        const uri = audioRecorder.uri;

        const result = await uploadAudio(uri!);

        if (!result) {
            setUpload(Process.FAILED);

            triggerToast({
                title: "Upload failed",
                description:
                    "Make sure to record your voice at least 15 seconds.",
                type: "error",
                duration: 5000,
                iconName: "warning",
                iconFamily: "Ionicons",
                delay: 500,
            });

            hasShownToast = false;
            return;
        }

        setUpload(Process.READY);

        setResult(CLASS.from(result));
        syncSegments();
    }

    // NOTE: Real-time Animated Waveform
    const previousValidMetering = useRef(-60);
    useEffect(() => {
        if (typeof currentMetering === "number") {
            let value = currentMetering;

            if (value === null || value === -160) {
                value = previousValidMetering.current;
            } else {
                previousValidMetering.current = value;
            }

            runOnUI(() => {
                animatedMeter.value = withSpring(value, {
                    damping: 15,
                    stiffness: 100,
                });
                // animatedMeter.value = withTiming(currentMetering);
            })();
        }
    }, [currentMetering]);

    const animatedRecordWaveInner = useAnimatedStyle(() => {
        const size = interpolate(
            animatedMeter.value,
            [-160, -80, -40, -10, -5, 0],
            [120, 120, 130, 135, 145, 155],
            Extrapolation.CLAMP,
        );

        return {
            width: size,
            height: size,
        };
    });

    const animatedRecordWaveOuter = useAnimatedStyle(() => {
        const size = interpolate(
            animatedMeter.value,
            [-160, -80, -40, -20, 0],
            [120, 130, 135, 150, 170],
            Extrapolation.CLAMP,
        );

        return {
            width: size,
            height: size,
        };
    });

    return (
        <SafeAreaView
            className={bgClass + " relative"}
            style={styles.container}
        >
            <Header title={"Recording"} back={true} menu={true} />
            <ToastMessage ref={toastMesRef} />
            <View className="my-5 px-3 flex-1">
                <View
                    style={{ elevation: 3 }}
                    className={
                        (isDark ? "bg-darkLayer" : "bg-white") +
                        " p-4 py-5 rounded-3xl gap-4"
                    }
                >
                    <View className="gap-2">
                        <Text
                            className={
                                textClass + " text-lg font-bold font-publicsans"
                            }
                        >
                            Selected Speech Script
                        </Text>
                        <View className="flex flex-row justify-between items-center pe-2">
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigateTo("select_language")}
                                className="flex flex-row items-center gap-4"
                            >
                                <LanguageSelected />
                                <AntDesign
                                    name="right"
                                    size={14}
                                    color={iconColor}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                className="flex flex-row gap-2 items-center"
                            >
                                <FontAwesome6
                                    size={20}
                                    className="text-center"
                                    width={20}
                                    name={"question-circle"}
                                    color="#006FFF"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="bg-transparent">
                        <LinearGradient
                            colors={[topStopColor, bottomStopColor]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="flex justify-center items-center"
                            style={{
                                borderRadius: 10,
                                padding: 1,
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
                                        " mx-4 py-3 pe-2 flex flex-row justify-between items-center " +
                                        borderColorClass
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
                                    {/* Recording Status */}
                                    {recordState.isRecording ? (
                                        recordState.isPaused ? (
                                            <View className="w-3 h-3 rounded-full bg-[#F39C11]"></View>
                                        ) : (
                                            <View className="w-3 h-3 rounded-full bg-active"></View>
                                        )
                                    ) : (
                                        <View className="w-3 h-3 rounded-full bg-idle"></View>
                                    )}
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View className="flex justify-center flex-1">
                    <View className="z-50">
                        <Text
                            className={
                                textClass +
                                " mx-auto text-3xl font-poppinsMedium"
                            }
                        >
                            {Timer.format(recordState.timer)}
                        </Text>
                    </View>

                    {/* Record Button */}
                    <View className="relative flex justify-center items-center my-5">
                        <Animated.View
                            style={[styles.recordWave, animatedRecordWaveInner]}
                        >
                            <LinearGradient
                                colors={["#006FFF", "#7800D3"]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.recordWave,
                                { opacity: 0.15 },
                                animatedRecordWaveOuter,
                            ]}
                        >
                            <LinearGradient
                                colors={["#006FFF", "#7800D3"]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>

                        <TouchableOpacity
                            activeOpacity={0.9}
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
                                    clearInterval(timerRef.current!);
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
                                        " w-36 h-36 flex justify-center items-center rounded-full"
                                    }
                                    style={styles.shadowProp}
                                >
                                    <GradientIcon name="microphone" size={60} />
                                    {/* {recordState.isRecording && */}
                                    {/* !recordState.isPaused ? ( */}
                                    {/*     <GradientIcon */}
                                    {/*         name="microphone" */}
                                    {/*         size={60} */}
                                    {/*     /> */}
                                    {/* ) : ( */}
                                    {/*     <Icon */}
                                    {/*         name="microphone" */}
                                    {/*         size={60} */}
                                    {/*         color="#006fff" */}
                                    {/*     /> */}
                                    {/* )} */}
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View className="text-center gap-1">
                        <Text
                            className={`text-xl mx-auto font-publicsansBold ${
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
                                " text-center text-sm font-publicsans"
                            }
                        >
                            {recordState.isRecording ? (
                                recordState.isPaused ? (
                                    <Text
                                        className={
                                            textClass + " text-center mt-4"
                                        }
                                    >
                                        Hold{"  "}
                                        <Icon
                                            name="microphone"
                                            size={16}
                                            color={micColor}
                                        />
                                        {"  "}
                                        to Stop Recording
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

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
            >
                <BlurView intensity={100} tint="dark" className="flex-1">
                    <View
                        className="flex-1 justify-center items-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <View
                            className={
                                modalColor + " mx-3 p-4 rounded-lg gap-4"
                            }
                        >
                            <View className="flex flex-row justify-between items-center">
                                <Text
                                    className={
                                        textClass +
                                        " text-lg font-publicsansBold"
                                    }
                                >
                                    Recording Guide
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                >
                                    <AntDesign
                                        name="close"
                                        size={18}
                                        color={isDark ? "white" : "black"}
                                    />
                                </TouchableOpacity>
                            </View>
                            {/* Divider */}
                            <View
                                className="-mx-4"
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />
                            <ScrollView className="-my-4 -mx-3 max-h-[300px]">
                                <View className="gap-4 py-4 px-3">
                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-2">
                                            <MaterialCommunityIcons
                                                name="record-rec"
                                                size={24}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Recording Interface Use
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            The Recording Interface allows users
                                            to record their voice using a
                                            selected speech script in either
                                            Filipino or English. This voice
                                            sample will be analyzed to detect
                                            signs of mild sleep deprivation.
                                        </Text>
                                    </View>
                                    <View className="gap-2">
                                        <View className="flex flex-row gap-2">
                                            <Ionicons
                                                name="language"
                                                size={20}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Speech Script Selection
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            At the top of the screen, users can{" "}
                                            <Text className="font-bold">
                                                select or change their preferred
                                            </Text>{" "}
                                            <Text className="font-bold">
                                                speech script language
                                            </Text>{" "}
                                            at any time. This ensures
                                            flexibility if the user wants to
                                            re-record using another script.
                                        </Text>
                                    </View>
                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-2">
                                            <MaterialCommunityIcons
                                                name="text-to-speech"
                                                size={20}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Speech Script Display
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            The selected speech script appears
                                            at the center of the screen. Users
                                            are advised to read this script in a
                                            quiet place and speak naturally as
                                            possible for accurate analysis.
                                        </Text>
                                    </View>

                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-2">
                                            <Entypo
                                                name="info-with-circle"
                                                size={16}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Current Status Instructions
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            Beneath the script, the app provides{" "}
                                            <Text className="font-bold">
                                                real-time instructions
                                            </Text>{" "}
                                            for using the microphone button:
                                        </Text>
                                        {statusInstructions.map(
                                            (item, index) => (
                                                <View
                                                    key={index}
                                                    className="flex flex-row items-start"
                                                >
                                                    <Text
                                                        className={
                                                            textClass +
                                                            " text-sm font-normal font-publicsans opacity-80 ps-4"
                                                        }
                                                    >
                                                        {"\u25CF"}
                                                    </Text>
                                                    <Text
                                                        className={
                                                            textClass +
                                                            " text-sm font-normal font-publicsans opacity-80 px-2"
                                                        }
                                                    >
                                                        <Text className="font-bold">
                                                            {item.state}{" "}
                                                            <Icon
                                                                name="microphone"
                                                                size={16}
                                                                color={micColor}
                                                            />{" "}
                                                            {item.bold}
                                                        </Text>
                                                        {item.desc}
                                                    </Text>
                                                </View>
                                            ),
                                        )}
                                    </View>
                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-2">
                                            <Ionicons
                                                name="timer"
                                                size={18}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Recording Segments
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            To ensure accurate detection, users
                                            are required their voice for at
                                            least
                                            <Text className="font-bold">
                                                {" "}
                                                15 seconds and up to 5 minutes
                                            </Text>
                                            . Any duration within this range
                                            will be accepted and automatically
                                            segmented into
                                            <Text className="font-bold">
                                                {" "}
                                                15-second chunks
                                            </Text>{" "}
                                            for analysis. Speak clearly in a
                                            calm and natural tone, and try to
                                            avoid background noise.
                                        </Text>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            The app will provide a
                                            <Text className="font-bold">
                                                {" "}
                                                live timer
                                            </Text>{" "}
                                            and
                                            <Text className="font-bold">
                                                {" "}
                                                message indicator
                                            </Text>{" "}
                                            to help guide you toward completing
                                            the full session. You may pause and
                                            resume as needed, but aim to finish
                                            the 5-minute session in a single
                                            sitting for best results.
                                        </Text>
                                    </View>
                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-3">
                                            <Icon
                                                name="microphone"
                                                size={16}
                                                color={iconColor}
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Recording Button
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            At the bottom, a large round
                                            <Text className="font-bold">
                                                {" "}
                                                microphone button{" "}
                                            </Text>
                                            serves as the control for starting,
                                            pausing, and stopping the recording.
                                            The button updates visually based on
                                            the current recording state to guide
                                            the user interactively.
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                            {/* Divider */}
                            <View
                                className="-mx-4"
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />
                            <View>
                                <TouchableHighlight
                                    className="flex w-full rounded-md py-3"
                                    style={{
                                        backgroundColor: isDark
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(0,0,0,0.1)",
                                    }}
                                    underlayColor={
                                        isDark
                                            ? "rgba(255,255,255,0.2)"
                                            : "rgba(0,0,0,0.2)"
                                    }
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text
                                        className={
                                            textClass +
                                            " text-center font-publicsans font-bold"
                                        }
                                    >
                                        Close
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Modal>

            <Overlay heading="Processing" state={upload} redirect="/analysis" />
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
    recordWave: {
        position: "absolute",
        opacity: 0.35,
        borderRadius: 1000,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        alignItems: "center",
        flex: 1,
        // color: "white",
        textAlign: "center",
    },
});
