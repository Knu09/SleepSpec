import { useContext, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { SplashScreen, useRouter } from "expo-router";
import { CLASS } from "@/types/types";
import TabNavigation from "@/components/TabNavigation";
import Accordion from "@/components/Accordion";
import { ThemeContext } from "@/context/ThemeContext";

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
                            "Describes the relationship between pitch and clarity, helping detect the richness or dullness in the voice.",
                    },
                    {
                        description:
                            "Analyzes how different frequency components (voice pitch, formants) change over time.",
                    },
                    {
                        description:
                            "Captures how fast or slow vocal frequencies modulate (e.g., irregular speech patterns due to fatigue).",
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
                            "Shows how fast the pitch patterns (high or low tones) are changing — helping identify monotone versus expressive speech.",
                    },
                    {
                        description:
                            "Examines the relationship between speech frequency components and spectral scales.",
                    },
                    {
                        description:
                            "Highlights how vocal harmonics and formants shift due to sleep deprivation.",
                    },
                ],
            },
            isOpened: false,
            image: "avg_freq_scale.png",
        },
    ];
    const { result } = useClassStore();
    const router = useRouter();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const borderColor = isDark ? "#006FFF" : "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const bottomStopColor = isDark ? "#7800D3" : "#01000F";
    const TabBackgroundColor = isDark ? "#01000F" : "#FFF";

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
        <SafeAreaView className={bgClass} style={styles.container}>
            <Header title={"Feature Analysis"} back={true} menu={true} />
            <View className="flex-1 pb-2">
                <ScrollView
                    className="px-6 pt-5 relative flex flex-grow flex-col"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        className={
                            (isDark ? "bg-darkLayer" : "bg-white") +
                            " flex justify-center items-center text-center text-secondary mb-10 gap-5 py-5 px-4 rounded-md"
                        }
                        style={{ elevation: 3 }}
                    >
                        <View className="flex justify-center items-center">
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

                        <View
                            className="flex flex-col rounded-xl "
                            style={{ borderWidth: 0.5, borderColor: "#585858" }}
                        >
                            <View
                                className={
                                    isDark ? "bg-arsenic" : "bg-grayLayer"
                                }
                                style={{
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    borderBottomColor: "#585858",
                                    borderBottomWidth: 0.5,
                                }}
                            >
                                <Text
                                    className={
                                        textClass +
                                        " p-3 text-start font-bold font-publicsans"
                                    }
                                >
                                    Spectro-Temporal Modulation
                                </Text>
                            </View>
                            <Text
                                className={textClass + " font-publicsans p-4"}
                            >
                                Spectro-Temporal Modulation (STM) helps us
                                understand the rhythm and texture of a person’s
                                voice — how their pitch (frequency) and loudness
                                (amplitude) change over time. In simpler terms,
                                it breaks down speech like a fingerprint,
                                showing how your voice moves up and down (like
                                melody) and how quickly it changes.
                            </Text>
                        </View>
                    </View>
                    <View className="flex flex-col items-center gap-5 mb-32">
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
