import { useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { useClassStore } from "@/store/store";
import { useRouter, SplashScreen } from "expo-router";
import { CLASS } from "@/types/types";
import TabNavigation from "@/components/TabNavigation";

export default function() {
    const { result } = useClassStore();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require(
            "../assets/fonts/Poppins/Poppins-Regular.ttf",
        ),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf",
        ),
        "PublicSans-Bold": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf",
        ),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return
    }

    const headerColor = result.class == CLASS.SD ? '#ff2121' : '#006fff';

    return (
        <SafeAreaView className="flex-1 bg-darkBg pt-10">
            <Header title={"Feature Analysis"} back={true} menu={true} />
            <View className="mt-10 px-6 flex-1">
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
                        <Text style={{ color: headerColor }} className={`font-publicsans text-2xl font-bold`}>
                            {CLASS.getTitle(result)}
                        </Text>
                    </View>
                </ScrollView>
                <TabNavigation />
            </View>
        </SafeAreaView>
    );
}
