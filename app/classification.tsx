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

const PLAY_BTN = require("@/assets/images/play-btn.svg");
const PAUSE_BTN = require("@/assets/images/pause-btn.svg");

export default function Classification() {
    const router = useRouter();
    const { result } = useClassStore();
    const { pendingSegments, syncResultsFrom } = useSegmentStore();
    const [segments, setSegments] = useState<Segment[]>([]);
    const [download, setDownload] = useState(Process.PENDING);
    const [playingSegmentID, setPlayingSegmentID] = useState<number | null>(
        null,
    );
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
            setSegments(syncResultsFrom(result.evals, segments));
        });
    }, []);

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    const togglePlay = (s: Segment) => {
        if (s.id != playingSegmentID) {
            setPlayingSegmentID(s.id);
            player.replace(s.uri);
            player.play();

            return true;
        } else {
            setPlayingSegmentID(null);
            if (player.playing) {
                player.pause();
                player.seekTo(0);
            } else {
                player.play();
            }
            return player.playing;
        }
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
                <View className="mt-4 gap-4">
                    {segments.map((segment) => (
                        <AudioSegment
                            key={segment.id}
                            segment={segment}
                            selected={playingSegmentID == segment.id}
                            togglePlay={togglePlay}
                            player={player}
                        />
                    ))}
                </View>

                <Overlay
                    heading="Downloading Audio Segments"
                    state={download}
                />
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
        </SafeAreaView>
    );
}

type AudioSegmentProps = {
    selected: boolean;
    segment: Segment;
    togglePlay: (s: Segment) => boolean;
    player: AudioPlayer;
};

function AudioSegment({
    selected,
    segment,
    togglePlay,
    player,
}: AudioSegmentProps) {
    const [seconds, setSeconds] = useState(0);
    const [playing, setPlaying] = useState(selected);
    const timerRef = useRef<number>(0);
    const timer = Timer.fromSeconds(seconds);

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkLayer" : "bg-white";

    useEffect(() => {
        const cleanup = () => {
            if (timerRef.current) {
                setSeconds(0);
                clearInterval(timerRef.current);
            }
        };

        if (playing) {
            timerRef.current = setInterval(() => {
                setPlaying(player.playing);

                if (player.playing) {
                    setSeconds((s) => s + 1);
                } else {
                    clearInterval(timerRef.current);
                    setSeconds(0);
                }
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
                <Text
                    className={
                        textClass +
                        " text-md font-publicsansLight font-semibold"
                    }
                >
                    Recording Segment {segment.id}
                </Text>
                <Text
                    className={
                        (isDark ? "text-secondary/50" : "text-darkBg/50") +
                        " font-publicsansLight text-md"
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
                <Text
                    className={textClass + " font-bold font-publicsans text-md"}
                >
                    Confidence Score:&nbsp;
                    <Text
                        className={
                            (isDark ? "text-secondary/50" : "text-darkBg/50") +
                            " font-light font-publicsansLight"
                        }
                    >
                        {CLASS.getConfScorePercent(segment)}
                    </Text>
                </Text>
            </View>

            <TouchableOpacity
                className={
                    (isDark ? "bg-white" : "bg-darkBg") +
                    " w-10 h-10 rounded-full"
                }
                onPress={() => setPlaying(togglePlay(segment))}
            >
                <View className="m-auto">
                    <FontAwesome6
                        size={18}
                        name={playing && selected ? "pause" : "play"}
                        color="#006FFF"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
