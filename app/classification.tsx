import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { useRouter, SplashScreen } from "expo-router";
import { CLASS, ClassResult } from "@/types/types";
import { Image } from "expo-image";
import TabNavigation from "@/components/TabNavigation";

const PLAY_BTN = require("@/assets/images/play-btn.svg");
const PAUSE_BTN = require("@/assets/images/pause-btn.svg");

export default function () {
    const { result } = useClassStore();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return;
    }

    return (
        <SafeAreaView className="flex-1 bg-darkBg pt-10">
            <Header title={"Classification"} back={true} menu={true} />
            <View className="mt-10 px-1 flex-1">
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
                    className="mt-10 px-6"
                    style={{
                        flex: 1,
                    }}
                >
                    <AudioSegment num={1} result={result} />
                </ScrollView>
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    <TabNavigation />
                </View>
            </View>
        </SafeAreaView>
    );
}

function AudioSegment({ num, result }: { num: number; result: ClassResult }) {
    const [playing, setPlaying] = useState(false);

    return (
        <View className="flex-1 flex-row justify-between">
            <View>
                <Text className="text-lg text-secondary font-semibold">
                    Recording Segment {num}
                </Text>
                <Text className="text-lightWhite">
                    00:00 / 00:15 &nbsp;&nbsp; 04/24/25
                </Text>
                <Text
                    className="font-semibold"
                    style={{ color: CLASS.getTitleColor(result) }}
                >
                    {CLASS.getTitle(result)}
                </Text>
                <Text className="text-secondary font-semibold">
                    Confidence Score:&nbsp;
                    <Text className="text-lightWhite font-normal">69.0%</Text>
                </Text>
            </View>

            <Pressable
                className="self-center"
                onPress={() => setPlaying((p) => !p)}
            >
                <Image
                    source={playing ? PAUSE_BTN : PLAY_BTN}
                    style={{ width: 42, aspectRatio: 1 }}
                />
            </Pressable>
        </View>
    );
}
