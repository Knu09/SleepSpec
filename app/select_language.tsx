import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";
import GradientSelectButton from "@/components/GradientSelectButton";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SplashScreen, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useLangStore } from "@/store/store";
import { LANG } from "@/types/types";

type LangChoiceProps = {
    lang: LANG;
    currentLang: LANG;
    border: string;
    setLang: React.Dispatch<React.SetStateAction<LANG>>;
};

export default function SelectLanguage() {
    const router = useRouter();
    const langStore = useLangStore();
    const [lang, setLang] = useState(langStore.currentLang);

    const languages: LangChoiceProps[] = [
        {
            lang: LANG.ENG1,
            currentLang: lang,
            border: "border-b-lightWhite",
            setLang,
        },
        {
            lang: LANG.ENG2,
            currentLang: lang,
            border: "border-x-lightWhite border-b-lightWhite",
            setLang,
        },
        {
            lang: LANG.FIL1,
            currentLang: lang,
            border: "border-b-lightWhite",
            setLang,
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
                        Select a language speech
                    </Text>
                </View>
            </View>
            <View className="bg-darkBg flex flex-1 pt-10 px-6">
                <View style={{ flex: 1 }}>
                    <View className="flex-row flex-wrap">
                        {languages.map(LangChoice)}
                    </View>
                </View>
            </View>
            <View className="bg-darkBg border border-t-lightWhite/50 py-8 items-center">
                <GradientSelectButton
                    pressHandler={() => {
                        langStore.setCurrentLang(lang);
                        router.back();
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function LangChoice({ lang, currentLang, border, setLang }: LangChoiceProps) {
    const IS_SELECTED = lang == currentLang;
    const { book, chapter } = LANG.getScript(lang);

    return (
        <Pressable
            key={lang}
            disabled={IS_SELECTED}
            onPress={() => setLang(lang)}
            className={`w-1/3 items-center p-2 py-5 border gap-3 ${border}`}
        >
            <Image
                style={{
                    width: 80,
                    aspectRatio: 1,
                    opacity: IS_SELECTED ? 1 : 0.5,
                }}
                source={LANG.asImg(lang)}
            />
            <View
                style={{
                    opacity: IS_SELECTED ? 1 : 0.5,
                }}
            >
                <Text className="text-primaryBlue text-center font-publicsans uppercase text-lg font-bold">
                    {LANG.asString(lang).toUpperCase()}
                </Text>
                <Text className="text-secondary text-center font-publicsans font-bold text-sm leading-6">
                    {book}
                </Text>
                <Text className="pb-2 text-secondary text-center font-publicsans text-sm leading-none">
                    {chapter}
                </Text>
            </View>
        </Pressable>
    );
}
