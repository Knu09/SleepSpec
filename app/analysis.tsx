import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Link, RelativePathString } from "expo-router";

SplashScreen.preventAutoHideAsync();

import Header from "@/components/Header";
import { useAdviceStore } from "@/store/store";
import Advice from "@/constants/analysis_advice";
import TabNavigation from "@/components/TabNavigation";

export default function Results() {
    const { currentAdvice, adviceRecommendations } = useAdviceStore();
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
        <SafeAreaView className="bg-[#01000f] flex-1">
            <Header title={"Analysis"} back={true} menu={true} />
            <View
                className="mt-10 px-6"
                style={{
                    flex: 1,
                }}
            >
                <View className="flex justify-center items-center text-center text-secondary">
                    <Text className="text-secondary">You are</Text>
                    <Text className="text-danger font-publicsans text-2xl font-bold">
                        Highly Sleep-deprived!
                    </Text>
                </View>
                <View className="my-6">
                    <LinearGradient
                        colors={["#006EFF", "#7800D3"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="flex"
                        style={{
                            borderRadius: 10,
                        }}
                    >
                        <View className="flex gap-6 rounded-[10px] bg-[#01000F] m-[1px] py-4 px-3">
                            <Text className=" text-secondary font-bold text-lg">
                                Detection Logs
                            </Text>
                            <View className="flex flex-row justify-between">
                                <View className="flex-1 gap-3">
                                    <Text className="text-secondary font-semibold">
                                        Categories
                                    </Text>
                                    <Text className="text-secondary">
                                        Sleep-deprived
                                    </Text>
                                    <Text className="text-secondary">
                                        Non-sleep-deprived
                                    </Text>
                                </View>
                                <View className="flex-1 gap-3">
                                    <Text className="text-secondary font-semibold text">
                                        Confidence Score
                                    </Text>
                                    <Text className="text-secondary">
                                        00.00%
                                    </Text>
                                    <Text className="text-secondary">
                                        00.00%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View className="gap-6">
                    <Text className="text-secondary">
                        {Advice[currentAdvice]}
                    </Text>
                    <FlatList
                        className=""
                        data={adviceRecommendations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="mt-2 flex flex-row gap-4">
                                <Text className="text-secondary leading-6">
                                    •
                                </Text>
                                <Text
                                    className="font-bold text-secondary
                                    "
                                >
                                    {item.title}:{" "}
                                    <Text className="font-normal text-secondary">
                                        {item.description}
                                    </Text>
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <TabNavigation />
            </View>
        </SafeAreaView>
    );
}

