import { useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { useRouter, SplashScreen } from "expo-router";
import { CLASS } from "@/types/types";
import TabNavigation from "@/components/TabNavigation";

// SplashScreen.preventAutoHideAsync();

export default function FeatureAnalysis() {
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
            <View className="px-6 flex-1">
                <ScrollView
                    className="mt-10 px-6"
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <View className="flex justify-center items-center text-center text-secondary">
                        <Text className="text-secondary">You are</Text>
                        <Text
                            style={{ color: CLASS.getTitleColor(result) }}
                            className={`font-publicsans text-2xl font-bold`}
                        >
                            {CLASS.getTitle(result)}
                        </Text>
                    </View>
                </ScrollView>

                <View
                    style={{
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
