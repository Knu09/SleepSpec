import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch,
} from "react-native";
import { Link } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useContext, useState } from "react";

SplashScreen.preventAutoHideAsync();

import Header from "@/components/Header";
import SettingButton from "@/components/SettingButton";

import { useNoise } from "@/context/NoiseContext";
import { ThemeContext } from "@/context/ThemeContext";

export default function Settings() {
    // noise reduction state
    const { noiseRemoval, toggleNoiseRemoval } = useNoise();

    // Theme state
    const { currentTheme, toggleTheme } = useContext(ThemeContext);

    const currentText =
        currentTheme === "dark" ? "text-secondary" : "text-darkBg";

    const currentLayer = currentTheme === "dark" ? "bg-darkLayer" : "bg-white";

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });
    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView
            className={currentTheme === "dark" ? "bg-darkBg" : "bg-lightBg"}
            style={styles.container}
        >
            <Header back={true} menu={true} title="Settings" />
            <ScrollView
                className="px-6 w-full text-start"
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "start",
                    gap: 10,
                    justifyContent: "start",
                }}
            >
                <View className="gap-5">
                    <View className="gap-2 py-5">
                        <Text className={currentText + " font-publicsans"}>
                            General
                        </Text>
                        <View
                            className={
                                currentLayer + " p-4 rounded-lg gap-5 shadow-md"
                            }
                        >
                            <View className="flex flex-row justify-between items-center">
                                <Text
                                    className={currentText + " font-publicsans"}
                                >
                                    Background Noise Removal
                                </Text>
                                <Switch
                                    trackColor={{
                                        false:
                                            currentTheme === "dark"
                                                ? "#808080"
                                                : "#ccc",
                                        true: "#006fff", // active color
                                    }}
                                    thumbColor={noiseRemoval ? "#eee" : "#fff"}
                                    onValueChange={toggleNoiseRemoval}
                                    value={noiseRemoval}
                                />
                            </View>
                            <View className="flex flex-row justify-between items-center">
                                <Text
                                    className={currentText + " font-publicsans"}
                                >
                                    Dark Mode
                                </Text>
                                <Switch
                                    value={currentTheme === "dark"}
                                    onValueChange={() =>
                                        toggleTheme(
                                            currentTheme === "light"
                                                ? "dark"
                                                : "light",
                                        )
                                    }
                                    trackColor={{
                                        false:
                                            currentTheme === "dark"
                                                ? "#808080"
                                                : "#ccc",
                                        true: "#006fff", // active color
                                    }}
                                    thumbColor={
                                        currentTheme === "dark"
                                            ? "#eee"
                                            : "#fff"
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    <View className="gap-2">
                        <Text className={currentText + " font-publicsans"}>
                            UI Mode
                        </Text>
                        <SettingButton
                            title="Light"
                            icon="light-up"
                            onPress={() => {}}
                            isActive={false}
                            theme={currentTheme}
                        />
                        <SettingButton
                            title="Dark"
                            icon="moon"
                            onPress={() => {}}
                            isActive={false}
                            theme={currentTheme}
                        />
                        <SettingButton
                            title="System"
                            icon="adjust"
                            onPress={() => {}}
                            isActive={false}
                            theme={currentTheme}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        color: "white",
        textAlign: "center",
    },
});
