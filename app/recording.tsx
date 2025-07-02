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
    const topStopColor = isDark ? "#006FFF" : "#595959";
    const bottomStopColor = isDark ? "#7800D3" : "#585858";
    const borderColorClass = isDark
        ? "border-primary border-t-[1px]"
        : "border-divider border-t-[1px]";
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";

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
                        (isDark ? "bg-darkLayer" : "bg-white") +
                        " p-4 rounded-3xl gap-4"
                    }
                >
                    <View className="gap-1">
                        <View className="flex flex-row justify-between items-center pe-2">
                            <Text
                                className={
                                    textClass +
                                    " text-lg font-bold font-publicsans"
                                }
                            >
                                Language Speech
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                            >
                                <FontAwesome6
                                    size={18}
                                    className="text-center"
                                    width={18}
                                    name={"question-circle"}
                                    color="#006FFF"
                                />
                            </TouchableOpacity>
                        </View>
                        <Link href="/select_language" className="w-28">
                            <LanguageSelected />
                        </Link>
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
                                        " mx-4 py-3 " +
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
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View className="flex justify-center flex-1">
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
                    <View className="flex justify-center items-center mb-2 mt-1">
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
                                        " text-lg font-bold font-publicsans"
                                    }
                                >
                                    Recording User Guide
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
                                                color="white"
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
                                                color="white"
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Language Speech Selection
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
                                                language speech script
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
                                                color="white"
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
                                                color="white"
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
                                                <View className="flex flex-row items-start">
                                                    <Text
                                                        className={
                                                            textClass +
                                                            " text-lg font-normal font-publicsans opacity-80 ps-4"
                                                        }
                                                    >
                                                        •
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
                                                color="white"
                                            />
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                Timer Display
                                            </Text>
                                        </View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans opacity-80"
                                            }
                                        >
                                            Just above the record button is a
                                            <Text className="font-bold">
                                                {" "}
                                                live timer{" "}
                                            </Text>
                                            , formatted in
                                            <Text className="font-bold">
                                                {" "}
                                                MM:SS{" "}
                                            </Text>
                                            , which shows how long the current
                                            recording has been running. Users
                                            are encouraged to reach the full
                                            15-second duration.
                                        </Text>
                                    </View>
                                    <View className="gap-2">
                                        <View className="flex flex-row items-center gap-3">
                                            <Icon
                                                name="microphone"
                                                size={16}
                                                color="white"
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
