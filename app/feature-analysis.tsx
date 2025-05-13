import { useEffect } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { SplashScreen, useRouter } from "expo-router";
import { CLASS } from "@/types/types";
import TabNavigation from "@/components/TabNavigation";
import Accordion from "@/components/Accordion";

// SplashScreen.preventAutoHideAsync();

export default function FeatureAnalysis() {
    const STM = [
        {
            title: "Scale-Rate Representation",
            list: {
                type: "bullet",
                items: [
                    {
                        description:
                            "Shows how fast the voice’s amplitude patterns change over time — like how quickly someone is speaking or emphasizing words.",
                    },
                    {
                        description:
                            "Displays how spectral(scale) and temporal(rate) modulations interact in speech.",
                    },
                    {
                        description:
                            "Captures rhythmic and dynamic changes in voice affected by sleep deprivation.",
                    },
                    {
                        description:
                            "Helps detect slower speech rates and altered spectral modulation, common in fatigued individuals.",
                    },
                ],
            },
            isOpened: true,
            image: "avg_scale_rate.png",
        },
        {
            title: "Frequency-Rate Representation",
            list: {
                type: "bullet",
                items: [
                    {
                        description:
                            "Shows how fast the voice’s amplitude patterns change over time — like how quickly someone is speaking or emphasizing words.",
                    },
                    {
                        description:
                            "Displays how spectral(scale) and temporal(rate) modulations interact in speech.",
                    },
                    {
                        description:
                            "Captures rhythmic and dynamic changes in voice affected by sleep deprivation.",
                    },
                    {
                        description:
                            "Helps detect slower speech rates and altered spectral modulation, common in fatigued individuals.",
                    },
                ],
            },
            isOpened: false,
            image: "avg_freq_rate.png",
        },
        {
            title: "Frequency-Scale Representation",
            list: {
                type: "bullet",
                items: [
                    {
                        description:
                            "Shows how fast the voice’s amplitude patterns change over time — like how quickly someone is speaking or emphasizing words.",
                    },
                    {
                        description:
                            "Displays how spectral(scale) and temporal(rate) modulations interact in speech.",
                    },
                    {
                        description:
                            "Captures rhythmic and dynamic changes in voice affected by sleep deprivation.",
                    },
                    {
                        description:
                            "Helps detect slower speech rates and altered spectral modulation, common in fatigued individuals.",
                    },
                ],
            },
            isOpened: false,
            image: "avg_freq_scale.png",
        },
    ];
    const { result } = useClassStore();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded && !result) {
            console.error("No Results Found!");
            router.replace("/"); // or router.back()
        }
    }, [fontsLoaded, result]);

    if (!fontsLoaded || !result) return null;

    return (
        <SafeAreaView className="flex-1 bg-darkBg pt-10">
            <Header title={"Feature Analysis"} back={true} menu={true} />
            <View className="px-6 flex-1 pb-2">
                <ScrollView
                    className="mt-4"
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <View className="flex justify-center items-center text-center text-secondary mb-10">
                        <Text className="text-secondary">You are</Text>
                        <Text
                            style={{ color: CLASS.getTitleColor(result) }}
                            className={`font-publicsans text-2xl font-bold`}
                        >
                            {CLASS.getTitle(result)}
                        </Text>
                    </View>
                    <View className="flex flex-col items-center gap-5 mb-32">
                        <View className="flex flex-col px-2">
                            <Text className="text-xl text-secondary text-center font-bold border-b-lightWhite">
                                Spectro-Temporal Modulation
                            </Text>
                            <View className="w-full h-[1px] bg-lightWhite"></View>
                            <Text className="text-secondary/80">
                                Spectro-Temporal Modulation (STM) helps us understand the rhythm
                                and texture of a person’s voice — how their pitch (frequency)
                                and loudness (amplitude) change over time. In simpler terms, it
                                breaks down speech like a fingerprint, showing how your voice
                                moves up and down (like melody) and how quickly it changes.
                            </Text>
                        </View>
                        {/* Customized Collapsible */}
                        {STM.map((stm, index) => (
                            <Accordion
                                key={index.toString()}
                                title={stm.title}
                                list={stm.list}
                                isOpened={stm.isOpened}
                                image={stm.image}
                            ></Accordion>
                        ))}
                    </View>
                </ScrollView>

                <View
                    className="bg-darkBg"
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
            </View>
        </SafeAreaView>
    );
}
