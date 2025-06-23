import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GradientSelectButton from "@/components/GradientSelectButton";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { SplashScreen, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useLangStore } from "@/store/store";
import { LANG } from "@/types/types";
import { ThemeContext } from "@/context/ThemeContext";

type LangChoiceProps = {
    lang: LANG;
    currentLang: LANG;
    setLang: React.Dispatch<React.SetStateAction<LANG>>;
};

export default function SelectLanguage() {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass =
        currentTheme === "dark" ? "text-secondary" : "text-bgDark";

    const router = useRouter();
    const langStore = useLangStore();
    const [lang, setLang] = useState(langStore.currentLang);

    const languages: LangChoiceProps[] = [
        {
            lang: LANG.ENG1,
            currentLang: lang,
            setLang,
        },
        {
            lang: LANG.ENG2,
            currentLang: lang,
            setLang,
        },
        {
            lang: LANG.FIL1,
            currentLang: lang,
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
            <StatusBar style="dark" backgroundColor="#fff" />;
            <View className="bg-white" style={styles.headerShadow}>
                <Header back={true} menu={true} theme="light" />
                <View className="bg-white pb-8 pt-6 px-6">
                    <Text className="font-poppins font-bold text-3xl">
                        Select a language speech
                    </Text>
                </View>
            </View>
            <View
                className={
                    (isDark ? "bg-darkBg" : "bg-lightBg") +
                    " flex flex-1 pt-10 px-6 z-0"
                }
            >
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

function LangChoice({ lang, currentLang, setLang }: LangChoiceProps) {
    const IS_SELECTED = lang == currentLang;
    const { book, chapter } = LANG.getScript(lang);

    let borderStyle = {};
    if (lang === LANG.ENG2) {
        borderStyle = {
            borderRightWidth: 0.5,
            borderLeftWidth: 0.5,
            borderRightColor: "#585858CC",
            borderLeftColor: "#585858CC",
        };
    }
    return (
        <Pressable
            key={lang}
            disabled={IS_SELECTED}
            onPress={() => setLang(lang)}
            style={borderStyle}
            className={`w-1/3 items-center p-2 py-5 gap-3`}
        >
            {" "}
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

const styles = StyleSheet.create({
    headerShadow: {
        elevation: 3,
        zIndex: 10,
    },
});
