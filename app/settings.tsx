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
import InfoModal from "@/components/InfoModal";

import { useWienerFiltering } from "@/context/WienerFilteringContext";
import { ThemeContext } from "@/context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNoiseReduction } from "@/context/NoiseReductionContext";
import { wienerReferences } from "@/constants/constant";
import { deepFilterNetReferences } from "@/constants/constant";

export default function Settings() {
    // noise reduction state
    const { noiseReductionMethod, setNoiseReductionMethod } =
        useNoiseReduction();

    const handleWienerToggle = (isOn: boolean) => {
        setNoiseReductionMethod(isOn ? "wiener" : "none");
    };

    const handleDFNToggle = (isOn: boolean) => {
        setNoiseReductionMethod(isOn ? "deepfilternet" : "none");
    };

    // InfoModal state
    const [isWienerInfoVisible, setWienerInfoVisible] = useState(false);
    const [isDFNInfoVisible, setDFNInfoVisible] = useState(false);

    // Theme state
    const { currentTheme, toggleTheme, useSystemTheme, isSystemTheme } =
        useContext(ThemeContext);

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
                <View className="gap-8 py-5">
                    {/* General Settings */}
                    <View className="gap-2">
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

                    {/* Background Noise Reduction Settings */}
                    <View className="gap-2">
                        <Text className={currentText + " font-publicsans"}>
                            Background Noise Reduction
                        </Text>
                        <View
                            className={
                                currentLayer + " p-4 rounded-lg gap-5 shadow-md"
                            }
                        >
                            <View className="flex flex-row justify-between items-center">
                                <View className="gap-3 flex-row items-center">
                                    <Text
                                        className={
                                            currentText + " font-publicsans"
                                        }
                                    >
                                        Wiener Filtering
                                    </Text>

                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            setWienerInfoVisible(true);
                                        }}
                                    >
                                        <FontAwesome6
                                            size={17}
                                            className="text-center"
                                            width={17}
                                            name={"question-circle"}
                                            color="#006FFF"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Switch
                                    trackColor={{
                                        false:
                                            currentTheme === "dark"
                                                ? "#808080"
                                                : "#ccc",
                                        true: "#006fff", // active color
                                    }}
                                    thumbColor={
                                        noiseReductionMethod === "wiener"
                                            ? "#eee"
                                            : "#fff"
                                    }
                                    onValueChange={handleWienerToggle}
                                    value={noiseReductionMethod === "wiener"}
                                />
                            </View>
                            <View className="flex flex-row justify-between items-center">
                                <View className="gap-3 flex-row items-center">
                                    <Text
                                        className={
                                            currentText + " font-publicsans"
                                        }
                                    >
                                        DeepFilterNet
                                    </Text>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            setDFNInfoVisible(true);
                                        }}
                                    >
                                        <FontAwesome6
                                            size={17}
                                            className="text-center"
                                            width={17}
                                            name={"question-circle"}
                                            color="#006FFF"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* TODO: Functionality of DeepFitlerNet */}
                                <Switch
                                    trackColor={{
                                        false:
                                            currentTheme === "dark"
                                                ? "#808080"
                                                : "#ccc",
                                        true: "#006fff", // active color
                                    }}
                                    thumbColor={
                                        noiseReductionMethod === "deepfilternet"
                                            ? "#eee"
                                            : "#fff"
                                    }
                                    onValueChange={handleDFNToggle}
                                    value={
                                        noiseReductionMethod === "deepfilternet"
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    {/* INFO MODALS */}
                    <InfoModal
                        title="Wiener Filtering"
                        description={
                            "It is primarily reduces stationary or slowly changing background noise by minimizing the mean square error between the desired signal and its estimate. It is most effective for consistent noises such as fan hums, air conditioners, or other steady ambient sounds.\n\n" +
                            "⚠️ When activated, Wiener filtering alters the acoustic features of your voice, which can affect the classifier’s performance in detecting mild sleep deprivation. This feature is designed to reduce unwanted background noise that could interfere with voice analysis, not to enhance detection accuracy.\n\n" +
                            "It is recommended to enable this option only in noisy environments where background interference is noticeable."
                        }
                        isModalVisible={isWienerInfoVisible}
                        onClose={() => setWienerInfoVisible(false)}
                        references={wienerReferences}
                    ></InfoModal>
                    <InfoModal
                        title="DeepFilterNet"
                        description={
                            "It is a deep learning–based noise suppression model that leverages neural networks to separate speech from background noise in real time. Unlike traditional filters, DeepFilterNet can adapt to highly dynamic and non-stationary noises such as human chatter, street sounds, or keyboard clicks.\n\n" +
                            "⚠️ When activated, DeepFilterNet may significantly alter subtle vocal features analyzed by the classifier for detecting mild sleep deprivation. While it can greatly improve speech clarity in noisy environments, this may come at the cost of reduced classification accuracy.\n\n" +
                            "⚠️ Additionally, DeepFilterNet is computationally more expensive compared to traditional filtering methods like Wiener filtering. Enabling it may increase processing time.\n\n" +
                            "This feature is best used only in highly noisy environments where other noise reduction methods are insufficient."
                        }
                        isModalVisible={isDFNInfoVisible}
                        onClose={() => setDFNInfoVisible(false)}
                        references={deepFilterNetReferences}
                    ></InfoModal>

                    {/* Theme Settings */}
                    <View className="gap-2">
                        <Text className={currentText + " font-publicsans"}>
                            Theme
                        </Text>
                        <SettingButton
                            title="Light"
                            icon="light-up"
                            onPress={() => {
                                toggleTheme("light");
                            }}
                            theme={currentTheme}
                            isActive={
                                !isSystemTheme && currentTheme === "light"
                            }
                        />
                        <SettingButton
                            title="Dark"
                            icon="moon"
                            onPress={() => {
                                toggleTheme("dark");
                            }}
                            isActive={!isSystemTheme && currentTheme === "dark"}
                            theme={currentTheme}
                        />
                        <SettingButton
                            title="System"
                            icon="adjust"
                            onPress={() => {
                                useSystemTheme();
                            }}
                            isActive={isSystemTheme}
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
