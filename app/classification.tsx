import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { useRouter, SplashScreen } from "expo-router";
import { CLASS, ClassResult } from "@/types/types";
import { Image } from "expo-image";
import TabNavigation from "@/components/TabNavigation";

const PLAY_BTN = require("@/assets/images/play-btn.svg")
const PAUSE_BTN = require("@/assets/images/pause-btn.svg")

export default function() {
    const { result } = useClassStore();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require(
            "../assets/fonts/Poppins/Poppins-Regular.ttf",
        ),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf",
        ),
        "PublicSans-Bold": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf",
        ),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return
    }

    const headerColor = result.class == CLASS.SD ? '#ff2121' : '#006fff';

    return (
        <SafeAreaView className="flex-1 bg-darkBg pt-10">
            <Header title={"Classification"} back={true} menu={true} />
            <View className="px-6 flex-1">
                <ScrollView
                    className="mt-10 px-6"
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <View className="flex justify-center items-center text-center text-secondary">
                        <Text className="text-secondary">You are</Text>
                        <Text style={{ color: headerColor }} className={`font-publicsans text-2xl font-bold`}>
                            {CLASS.getTitle(result)}
                        </Text>
                    </View>
                </ScrollView>
                <TabNavigation />
            </View>
        </SafeAreaView>
    );
}

function AudioSegment({ num, result }: { num: number, result: ClassResult }) {
    const titleColor = result.class == CLASS.SD ? '#ff2121' : '#006fff';

    const [playing, setPlaying] = useState(false)

    return (
        <View className="flex-1 flex-row">
            <View>
                <Text className="text-secondary">
                    Recording Segment {num}
                </Text>
                <Text className="text-lightWhite">
                    00:00 / 00:15
                </Text>
                <Text style={{color: titleColor}}>
                    {CLASS.getTitle(result)}
                </Text>
            </View>

            <Pressable onPress={() => setPlaying(p => !p)}>
                <Image source={playing ? PLAY_BTN : PAUSE_BTN} />
            </Pressable>
        </View>
    )
}
