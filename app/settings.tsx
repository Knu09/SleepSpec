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
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useContext } from "react";

SplashScreen.preventAutoHideAsync();

import Header from "@/components/Header";
import SettingButton from "@/components/SettingButton";
import { ThemeContext } from "@/context/ThemeContext";

export default function Settings() {
    const { currentTheme, toggleTheme } = useContext(ThemeContext);

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
        <SafeAreaView className="bg-darkBg" style={styles.container}>
            <StatusBar />
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
                    <View className="gap-2">
                        <Text className="text-secondary font-publicsans">
                            General
                        </Text>
                        <View className="bg-darkLayer p-4 rounded-lg gap-5">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-secondary">
                                    Noise Reduction
                                </Text>
                                <Switch />
                            </View>
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-secondary">
                                    Background Noise Remover
                                </Text>
                                <Switch />
                            </View>
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-secondary">
                                    Dark Mode
                                </Text>
                                <Switch
                                    value={currentTheme === "light"}
                                    onValueChange={() =>
                                        toggleTheme(
                                            currentTheme === "dark"
                                                ? "light"
                                                : "dark",
                                        )
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    <View className="gap-2">
                        <Text className="text-secondary font-publicsans">
                            UI Mode
                        </Text>
                        <SettingButton
                            title="Light"
                            icon="light-up"
                            onPress={() => {}}
                            isActive={false}
                        />
                        <SettingButton
                            title="Dark"
                            icon="moon"
                            onPress={() => {}}
                            isActive={false}
                        />
                        <SettingButton
                            title="System"
                            icon="adjust"
                            onPress={() => {}}
                            isActive={false}
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
