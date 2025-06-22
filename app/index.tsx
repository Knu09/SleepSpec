import "react-native-gesture-handler";
import "@/global.css";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useRef } from "react";
import SleepSpecLogo from "@/components/SleepSpecLogo";
import SleepSpecTitle from "@/components/SleepSpecTitle";

SplashScreen.preventAutoHideAsync();

import Header from "@/components/Header";
import LanguageSelected from "@/components/LanguageSelected";
import { ThemeContext } from "@/context/ThemeContext";

export default function Index() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("@/assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("@/assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    const { currentTheme } = useContext(ThemeContext);
    const textClass = currentTheme === "dark" ? "text-secondary" : "text-black";

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView
            className={currentTheme === "dark" ? "bg-darkBg" : "bg-lightBg"}
            style={styles.container}
        >
            <Header userMan={true} menu={true} />
            <ScrollView
                className="px-6"
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "flex-start",
                }}
            >
                <View className="flex flex-col items-center">
                    <SleepSpecLogo></SleepSpecLogo>
                    <SleepSpecTitle
                        width={218 + 100}
                        height={72.5}
                    ></SleepSpecTitle>
                    <Text
                        className={
                            textClass + " text-center px-5 font-publicsans"
                        }
                        style={styles.subtitle}
                    >
                        Sleep Deprivation Detection using SVM
                    </Text>
                </View>
                <View className="my-24 items-center gap-4">
                    <View className="items-center flex-row flex-wrap justify-center px-4">
                        <Text className="text-secondary text-base font-publicsans text-center">
                            Start{" "}
                        </Text>

                        <View className="flex-row items-center px-2 py-1 rounded-full bg-[#35007680] mx-1">
                            <Icon name="microphone" size={16} color="#006FFF" />
                            <Text className="font-semibold text-primaryBlue ms-1">
                                detecting
                            </Text>
                        </View>
                        <Text className="text-secondary text-base font-publicsans text-center">
                            sleep deprivation by clicking the microphone below.
                        </Text>
                    </View>
                    <View>
                        <Link href="/select_language">
                            <LinearGradient
                                colors={["#006EFF", "#7800D3"]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                className="flex justify-center items-center"
                                style={{
                                    borderRadius: 15,
                                }}
                            >
                                <View
                                    className="rounded-[15px] items-center py-3 m-[1px] px-4 bg-[#01000F]"
                                    style={styles.button}
                                >
                                    <Text className="font-bold font-publicsans text-secondary mb-2">
                                        Select a language speech
                                    </Text>
                                    <LanguageSelected />
                                </View>
                            </LinearGradient>
                        </Link>
                    </View>
                </View>
                <View className="flex items-center t-10">
                    <Link href="/recording">
                        <LinearGradient
                            colors={["#006EFF", "#7800D3"]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="justify-center items-center p-[2px]"
                            style={styles.linearGradientMicrophone}
                        >
                            <View className="w-40 h-40 flex justify-center items-center bg-[#01000F] rounded-full">
                                <Icon
                                    name="microphone"
                                    size={60}
                                    color={"#FFF"}
                                />
                            </View>
                        </LinearGradient>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {},

    container: {
        flex: 1,
        alignItems: "center",
        // color: "white",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 15,
    },

    linearGradientMicrophone: {
        borderRadius: 100,
    },

    gradient: { flex: 1 },

    row: {
        flexDirection: "row",
        marginTop: 5,
        alignItems: "center",
    },
});
