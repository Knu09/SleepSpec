import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "react-native";
import GradientSelectButton from "@/components/GradientSelectButton";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

enum ID {
    ENGLISH = 1,
    FILIPINO = 2,
}

interface LangChoiceProps {
    id: number;
    src: NodeJS.Require;
    name: string;
    border: string;
}

export default function SelectLanguage() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("@/assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("@/assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className="bg-white" style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <View className="">
                <Header back={true} menu={true} />
                <View className="pb-8 pt-6 px-6">
                    <Text className="font-poppins font-bold text-3xl">
                        Select language
                    </Text>
                </View>
            </View>
            <View className="bg-darkBg flex flex-1 pt-10 px-6">
                <View style={{ flex: 1 }}>
                    <View className="flex-row flex-wrap">
                        {languages.map(LangChoice)}
                        <View className="w-1/3 border border-b-lightWhite"></View>
                    </View>
                </View>
            </View>
            <View className="bg-darkBg border border-t-lightWhite py-8 items-center">
                <GradientSelectButton />
            </View>
        </SafeAreaView>
    );
}

function LangChoice({ id, src, name, border }: LangChoiceProps) {
    return (
        <Pressable
            key={id}
            className={`w-1/3 items-center p-7 border gap-3 ${border}`}
        >
            <Image style={{ width: 80, aspectRatio: 1 }} source={src} />
            <Text className="text-white text-xl font-bold">{name}</Text>
        </Pressable>
    );
}

const languages: LangChoiceProps[] = [
    {
        id: ID.ENGLISH,
        src: require("@/assets/images/flag-us.svg"),
        name: "English",
        border: "border-b-lightWhite",
    },
    {
        id: ID.FILIPINO,
        src: require("@/assets/images/flag-ph.svg"),
        name: "Filipino",
        border: "border-x-lightWhite border-b-lightWhite",
    },
];
