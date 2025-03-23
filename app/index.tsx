import { Route } from "expo-router/build/Route";
import "@/global.css";
import {
    StyleSheet,
    Pressable,
    View,
    ScrollView,
    Button,
    Image,
    Text,
} from "react-native";
import { Stack, useRouter, Link } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
// import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

SplashScreen.preventAutoHideAsync();
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import Header from "@/components/Header";

const FlagPH = require("@/assets/images/philippines 1.svg");

export default function Index() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className="px-6 bg-[#01000F]" style={styles.container}>
            <StatusBar />
            <Header title={"Home"} userMan={true} menu={true} />
            <ScrollView
                className="mt-10 px-6"
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
            >
                {/* <MaskedView */}
                {/*     maskElement={<Text style={styles.title}>SleepSpec.</Text>} */}
                {/* > */}
                {/*     <LinearGradient */}
                {/*         colors={["#006EFF", "#7800D3"]} */}
                {/*         style={styles.gradient} */}
                {/*     /> */}
                {/* </MaskedView> */}
                <View>
                    <Text className="text-center font-poppins text-5xl text-white font-bold">
                        SleepSpec
                    </Text>
                    <Text className="text-center mt-2 text-2xl font-poppins text-white font-bold">
                        Sleep Deprition Detection using SVM
                    </Text>
                </View>
                <View className="my-12 items-center gap-6">
                    <View>
                        <Text className="text-white font-publicsans text-center">
                            Start
                            <View className="inline-flex flex-row items-center mx-2 py-2 px-2 bg-[#35007680] rounded-full">
                                <Icon
                                    className="me-2"
                                    name="microphone"
                                    size={20}
                                    color={"#006FFF"}
                                />
                                <Text className="text-primary font-semibold text-[#006FFF]">
                                    detecting
                                </Text>
                            </View>
                            sleep deprivation by clicking the microphone below.
                        </Text>
                    </View>
                    <View>
                        <LinearGradient
                            colors={["#006EFF", "#7800D3"]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="flex justify-center items-center p-[1.5px]"
                            style={styles.linearGradientLanguage}
                        >
                            <Pressable
                                className="rounded-[22px] items-center gap-4 py-4  px-10 bg-[#01000F]"
                                style={styles.button}
                                onPress={() => console.log("Pressed")}
                            >
                                <Text className="font-bold text-white mb-2">
                                    Select language
                                </Text>
                                <View className="flex flex-row items-center text gap-2">
                                    <Image
                                        source={FlagPH}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text className="text-white">Filipino</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>
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
                                    size={50}
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
        color: "white",
        textAlign: "center",
    },

    linearGradientMicrophone: {
        borderRadius: 100,
    },

    linearGradientLanguage: {
        borderRadius: 22,
    },

    gradient: { flex: 1 },

    row: {
        flexDirection: "row",
        marginTop: 5,
        alignItems: "center",
    },
});
