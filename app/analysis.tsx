import { FlatList, Text, View } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import { useClassStore } from "@/store/store";
import { CLASS } from "@/types/types";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Results() {
    const { result } = useClassStore();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return null;
    }

    const advices = CLASS.getAdvices(result);
    const headerColor = result.class === CLASS.SD ? "#ff2121" : "#006fff";

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className="bg-darkBg flex-1">
            <Header title={"Analysis"} back={true} menu={true} />
            <View className="mt-10 px-6 flex-1">
                <View className="flex justify-center items-center text-center">
                    <Text className="text-secondary">You are</Text>
                    <Text
                        style={{ color: headerColor }}
                        className="font-publicsans text-2xl font-bold"
                    >
                        {CLASS.toHeader(result)}
                    </Text>
                </View>

                <View className="my-6">
                    <Text className="text-secondary text-xl mb-4 font-medium text-center">
                        Confidence Score:
                    </Text>
                    <Text className="text-5xl text-center font-extrabold text-secondary">
                        {CLASS.getConfScorePercent(result)}
                    </Text>
                </View>

                <View className="gap-6 mb-4">
                    <Text className="text-secondary">{advices.summary}</Text>
                </View>

                <FlatList
                    data={advices.contents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="mt-2 flex flex-row gap-4">
                            <Text className="text-secondary leading-6">•</Text>
                            <View className="flex-1">
                                <Text className="font-bold text-secondary">
                                    {item.title}:{" "}
                                    <Text className="font-normal text-secondary">
                                        {item.description}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    )}
                />

                <TabNavigation />
            </View>
        </SafeAreaView>
    );
}
