import { useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { useRouter, SplashScreen } from "expo-router";
import { CLASS } from "@/types/types";
import TabNavigation from "@/components/TabNavigation";
import Accordion from "@/components/Accordion";

// SplashScreen.preventAutoHideAsync();

export default function FeatureAnalysis() {
    const STM = [
        {
            title: "Scale-Rate Representation",
            description:
                "Displays how spectral (scale) and temporal (rate) modulatinos interact in speech. It rhythmic and dynamic changes in voice affected by sleep deprivation. It helps detect slower speech rates and altered spectral modulation, common in fatigued individuals. ",
            isOpened: true,
        },
        {
            title: "Frequency-Rate Representation",
            description:
                "Examines the relationship between speech frequency components and spectral scales. It highlights how vocal harmonics and formants shift due to sleep deprivation.",
            isOpened: false,
        },
        {
            title: "Frequency-Scale Representation",
            description:
                "Analyzes how different frequency components (voice pitch, formants) change over time. It captures how fast or slow vocal frequencies modulate (e.g., irregular speech patterns due to fatigue).",
            isOpened: false,
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
            <View className="px-6 flex-1 pb-28">
                <ScrollView
                    className="mt-10"
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
                    <View className="flex flex-col items-center gap-5">
                        <View className="flex flex-col px-2">
                            <Text className="text-secondary text-center font-bold border-b-lightWhite">
                                Spectro-Temporal Modulation
                            </Text>
                            <View className="w-full h-[1px] bg-lightWhite"></View>
                            <Text className="text-secondary/80">
                                Spectro-temporal modulation (STM) description
                                goes here...
                            </Text>
                        </View>
                        {/* Customized Collapsible */}
                        {STM.map((stm, index) => (
                            <Accordion
                                key={index.toString()}
                                title={stm.title}
                                description={stm.description}
                                isOpened={stm.isOpened}
                            ></Accordion>
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
                    }}
                >
                    <TabNavigation />
                </View>
            </View>
        </SafeAreaView>
    );
}
