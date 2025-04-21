import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, GestureResponderEvent } from "react-native";
import GradientSelectButton from "@/components/GradientSelectButton";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SplashScreen, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useLangStore } from "@/store/store"
import { LANG } from "@/types/types";

interface LangChoiceProps {
    lang: LANG;
    src: NodeJS.Require;
    name: string;
    border: string;
    setLang: React.Dispatch<React.SetStateAction<LANG>>
}

export default function SelectLanguage() {
    const router = useRouter()
    const langStore = useLangStore((state) => state)
    const [lang, setLang] = useState(langStore.currentLang)

    const languages: LangChoiceProps[] = [
        {
            lang: LANG.ENGLISH,
            src: require("@/assets/images/flag-us.svg"),
            name: "English",
            border: "border-b-lightWhite",
            setLang
        },
        {
            lang: LANG.FILIPINO,
            src: require("@/assets/images/flag-ph.svg"),
            name: "Filipino",
            border: "border-x-lightWhite border-b-lightWhite",
            setLang
        },
    ];

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
                <GradientSelectButton
                    pressHandler={() => {
                        langStore.setCurrentLang(lang)
                        router.back()
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function LangChoice({ lang, src, name, border, setLang }: LangChoiceProps) {
    return (
        <Pressable
            key={lang}
            onPress={() => setLang(lang)}
            className={`w-1/3 items-center p-7 border gap-3 ${border}`}
        >
            <Image style={{ width: 80, aspectRatio: 1 }} source={src} />
            <Text className="text-white text-xl font-bold">{name}</Text>
        </Pressable>
    );
}
