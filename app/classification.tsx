import { useEffect, useState, useRef } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { Segment, useClassStore, useSegmentStore } from "@/store/store";
import { SplashScreen, useRouter } from "expo-router";
import { CLASS, ClassResult, Process, Timer } from "@/types/types";
import { Image } from "expo-image";
import TabNavigation from "@/components/TabNavigation";
import Overlay from "@/components/Overlay";
import { AudioPlayer, useAudioPlayer } from "expo-audio";

const PLAY_BTN = require("@/assets/images/play-btn.svg");
const PAUSE_BTN = require("@/assets/images/pause-btn.svg");

export default function Classification() {
    const router = useRouter();
    const { result } = useClassStore();
    const { pendingSegments } = useSegmentStore();
    const [segments, setSegments] = useState<Segment[]>([]);
    const [download, setDownload] = useState(Process.PENDING);
    const [playingSegmentID, setPlayingSegmentID] = useState<number | null>(null);
    const player = useAudioPlayer(undefined);

    useEffect(() => {
        pendingSegments.then((value) => {
            if (value.length == 0) {
                setDownload(Process.FAILED);
                return;
            }

            setDownload(Process.READY);
            setSegments(value);
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

    const signalFinish = () => {
        setPlayingSegmentID(null)
    };

    const togglePlay = (s: Segment) => {
        if (s.id != playingSegmentID) {
            setPlayingSegmentID(s.id)
            player.replace(s.uri);
            player.play();

            return true;
        } else {
            if (player.playing) {
                player.pause();
                player.seekTo(0);
            } else {
                player.play();
            }
            return player.playing
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
        <SafeAreaView className="flex-1 bg-darkBg pt-10">
            <Header title={"Classification"} back={true} menu={true} />
            <View className="mt-10 px-1 flex-1 pb-28">
                <View className="flex justify-center items-center text-center text-secondary">
                    <Text className="text-secondary">You are</Text>
                    <Text
                        style={{ color: CLASS.getTitleColor(result) }}
                        className={`font-publicsans text-2xl font-bold`}
                    >
                        {CLASS.getTitle(result)}
                    </Text>
                </View>
                <ScrollView
                    className="mt-4 px-6"
                    style={{
                        flex: 1,
                    }}
                >
                    {segments.map((segment) => (
                        <AudioSegment
                            key={segment.id}
                            segment={segment}
                            result={result}
                            selected={playingSegmentID == segment.id}
                            togglePlay={togglePlay}
                            player={player}
                            signalFinish={signalFinish}
                        />
                    ))}
                </ScrollView>
                <View
                    style={{
                        zIndex: 100,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    <TabNavigation />
                </View>
                <Overlay heading="Downloading Audio Segments" state={download} />
            </View>
        </SafeAreaView>
    );
}

type AudioSegmentProps = {
    selected: boolean;
    segment: Segment;
    result: ClassResult;
    togglePlay: (s: Segment) => boolean;
    player: AudioPlayer,
    signalFinish: () => void;
};

function AudioSegment({
    selected,
    segment,
    result,
    togglePlay,
    player,
    signalFinish,
}: AudioSegmentProps) {
    const [seconds, setSeconds] = useState(0);
    const [playing, setPlaying] = useState(false);
    const timerRef = useRef<number>(0);
    const timer = Timer.fromSeconds(seconds)

    useEffect(() => {
        const cleanup = () => {
            if (timerRef.current) {
                setSeconds(0);
                clearInterval(timerRef.current);
            }
        }

        if (selected) {
            timerRef.current = setInterval(() => {
                setPlaying(player.playing)

                if (player.playing) {
                    setSeconds(s => s + 1)
                } else {
                    clearInterval(timerRef.current)
                    setSeconds(0)
                }
            }, 1000);
        }

        // remove interval when component unmounts
        return cleanup;
    }, [selected]);

    return (
        <View className="flex-1 flex-row justify-between mt-7">
            <View>
                <Text className="text-lg text-secondary font-semibold">
                    Recording Segment {segment.id}
                </Text>
                <Text className="text-lightWhite">
                    {Timer.format(timer)} / 00:15 &nbsp;&nbsp;
                    <Text
                        className="font-semibold"
                        style={{ color: CLASS.getTitleColor(result) }}
                    >
                        {CLASS.getTitle(result)}
                    </Text>
                </Text>
                <Text className="text-secondary font-semibold">
                    Confidence Score:&nbsp;
                    <Text className="text-lightWhite font-normal">69.0%</Text>
                </Text>
            </View>

            <Pressable className="self-center" onPress={() => {
                setPlaying(togglePlay(segment))
            }}>
                <Image
                    source={playing && selected ? PAUSE_BTN : PLAY_BTN}
                    style={{ width: 42, aspectRatio: 1 }}
                />
            </Pressable>
        </View>
    );
}
