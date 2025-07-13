import { useEffect, useState, useRef, useContext } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { Segment, useClassStore, useSegmentStore } from "@/store/store";
import { SplashScreen, useRouter } from "expo-router";
import { CLASS, Process, Timer } from "@/types/types";
import { Image } from "expo-image";
import TabNavigation from "@/components/TabNavigation";
import Overlay from "@/components/Overlay";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

type RecordPlayer = {
    segment: Segment;
    playing: boolean;
};

export default function Classification() {
    const router = useRouter();
    const { result } = useClassStore();
    const { pendingSegments, syncResultsFrom } = useSegmentStore();
    const [recordPlayers, setRecordPlayers] = useState<RecordPlayer[]>([]);
    const [download, setDownload] = useState(Process.PENDING);
    const player = useAudioPlayer(undefined);

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const borderColor = isDark ? "#006FFF" : "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const bottomStopColor = isDark ? "#7800D3" : "#01000F";
    const TabBackgroundColor = isDark ? "#01000F" : "#FFF";

    useEffect(() => {
        if (!result) {
            console.error("No Results Found!");
            return;
        }

        pendingSegments.then((segments) => {
            if (segments.length == 0) {
                setDownload(Process.FAILED);
                return;
            }

            setDownload(Process.READY);
            setRecordPlayers(
                syncResultsFrom(result.evals, segments).map((segment) => {
                    return {
                        segment,
                        playing: false,
                    } as RecordPlayer;
                }),
            );
        });
    }, []);

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Light": require("../assets/fonts/Public_Sans/static/PublicSans-Light.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    const togglePlay = (rp: RecordPlayer) => {
        setRecordPlayers((prevPlayers) =>
            prevPlayers.map((recordPlayer) => {
                const { segment, playing } = recordPlayer;
                if (segment.id == rp.segment.id) {
                    if (playing) {
                        player.pause();
                        player.seekTo(0);
                    } else {
                        player.replace(segment.uri);
                        player.play();
                    }

                    return {
                        ...recordPlayer,
                        playing: !playing,
                    } as RecordPlayer;
                }

                return { ...recordPlayer, playing: false } as RecordPlayer;
            }),
        );
    };

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return;
    } else if (download == Process.FAILED) {
        console.error("There was a problem downloading the segments :(");
        router.back();
        return;
    }

    return (
        <SafeAreaView className={bgClass} style={styles.container}>
            <Header title={"Classification"} back={true} menu={true} />
            <ScrollView className="mt-5 px-3 relative flex flex-grow flex-col">
                <View className="flex justify-center items-center text-center text-secondary">
                    <Text className={textClass + " font-publicsans"}>
                        You are
                    </Text>
                    <Text
                        style={{ color: CLASS.getTitleColor(result) }}
                        className={`font-publicsans text-2xl font-bold`}
                    >
                        {CLASS.getTitle(result)}
                    </Text>
                </View>
                <View className="mt-4 mb-28 gap-4">
                    {recordPlayers.map((recordPlayer) => (
                        <AudioSegment
                            key={recordPlayer.segment.id}
                            recordPlayer={recordPlayer}
                            togglePlay={togglePlay}
                        />
                    ))}
                </View>
            </ScrollView>

            <View
                style={{
                    zIndex: 100,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: TabBackgroundColor,
                }}
            >
                <TabNavigation />
            </View>

            <Overlay heading="Downloading Audio Segments" state={download} />
        </SafeAreaView>
    );
}

type AudioSegmentProps = {
    recordPlayer: RecordPlayer;
    togglePlay: (s: RecordPlayer) => void;
};

function AudioSegment({ recordPlayer, togglePlay }: AudioSegmentProps) {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkLayer" : "bg-white";

    const { segment, playing } = recordPlayer;
    const [seconds, setSeconds] = useState(0);
    const timer = Timer.fromSeconds(seconds);
    const timerRef = useRef(0);

    useEffect(() => {
        const cleanup = () => {
            if (timerRef.current != 0) {
                setSeconds(0);
                clearInterval(timerRef.current);
            }
        };

        if (playing) {
            timerRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        }

        // remove interval when component unmounts
        return cleanup;
    }, [playing]);

    return (
        <View
            style={{ elevation: 3 }}
            className={
                bgClass + " flex flex-row justify-between rounded-lg p-4"
            }
        >
            <View>
                <View className="flex flex-row justify-between w-full">
                    <View className="flex flex-col">
                        <Text
                            className={
                                textClass + " text-lg font-bold font-publicsans"
                            }
                        >
                            Recording Segment {segment.id}
                        </Text>
                        <Text
                            className={
                                (isDark
                                    ? "text-secondary/50"
                                    : "text-darkBg/50") +
                                " font-publicsansLight text-md leading-4"
                            }
                        >
                            {Timer.format(timer)} / 00:15 &nbsp;&nbsp;
                        </Text>
                        <Text
                            className="font-semibold font-pulicsans text-md"
                            style={{ color: CLASS.getTitleColor(segment) }}
                        >
                            {CLASS.getTitle(segment)}
                        </Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            className={
                                (isDark ? "bg-white" : "bg-darkBg") +
                                " w-10 h-10 rounded-full"
                            }
                            onPress={() => togglePlay(recordPlayer)}
                        >
                            <View className="m-auto">
                                <FontAwesome6
                                    size={18}
                                    name={playing ? "pause" : "play"}
                                    color="#006FFF"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Divider */}
                <View
                    style={{
                        marginVertical: 10,
                        height: 0.5,
                        backgroundColor: "#585858CC",
                    }}
                />
                <View>
                    <Text
                        className={
                            textClass +
                            " font-publicsans font-bold text-md mb-2"
                        }
                    >
                        Detection Logs
                    </Text>
                    <View className="flex flex-row justify-between">
                        <Text
                            className={
                                textClass +
                                " font-publicsansLight text-md opacity-80"
                            }
                        >
                            Confidence Score&nbsp;
                        </Text>
                        <Text
                            className={
                                (isDark ? "text-secondary" : "text-darkBg") +
                                " font-publicsansLight opacity-80 text-md"
                            }
                        >
                            {CLASS.getConfScorePercent(segment)}
                        </Text>
                    </View>
                    <View className="flex flex-row justify-between">
                        <Text
                            className={
                                textClass +
                                " font-publicsansLight text-md opacity-80 leading-5"
                            }
                        >
                            Decision Score&nbsp;
                        </Text>
                        <Text
                            className={
                                (isDark ? "text-secondary" : "text-darkBg") +
                                " font-publicsansLight opacity-80 text-md leading-5"
                            }
                        >
                            {CLASS.getDecScorePercent(segment)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
