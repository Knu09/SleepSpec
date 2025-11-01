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
    const router = useRouter();
    const langStore = useLangStore();
    const [lang, setLang] = useState(langStore.currentLang);

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass =
        currentTheme === "dark" ? "text-secondary" : "text-bgDark";

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
        {
            lang: LANG.FIL2,
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
            <StatusBar
                style="dark"
                backgroundColor="#fff"
                translucent={false}
            />
            <View className="bg-white" style={styles.headerShadow}>
                <Header back={true} menu={true} theme="light" />
                <View
                    className="bg-white gap-1 py-6 px-6"
                    style={{ zIndex: 2000 }}
                >
                    <Text className="font-poppinsBold leading-10 text-3xl">
                        Speech Script Language
                    </Text>
                    <Text className="font-publicsans text-sm opacity-80">
                        Choose a book script you'll read during the recording.
                    </Text>
                </View>
            </View>
            <View
                style={{ flex: 1 }}
                className={
                    (isDark ? "bg-darkBg" : "bg-lightBg") +
                    " flex flex-1 py-5 px-3 z-0"
                }
            >
                <View
                    style={{ elevation: 3 }}
                    className={
                        (isDark ? "bg-darkLayer" : "bg-white") +
                        " px-3 py-5 rounded-3xl"
                    }
                >
                    <View className="flex-row flex-wrap gap-y-6">
                        {languages.map(LangChoice)}
                    </View>
                </View>
            </View>
            <View
                style={{
                    borderTopWidth: 0.5,
                    borderTopColor: "#585858CC",
                }}
                className={
                    (isDark ? "bg-darkBg" : "bg-white") + " py-8 items-center"
                }
            >
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

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass =
        currentTheme === "dark" ? "text-secondary" : "text-bgDark";

    let borderStyle = {};
    if (lang === LANG.ENG2) {
        borderStyle = {
            borderRightWidth: 0.5,
            borderLeftWidth: 0.5,
            borderRightColor: "#585858CC",
            borderLeftColor: "#585858CC",
        };
    }

    if (lang === LANG.FIL2) {
        borderStyle = {
            borderRightWidth: 0.5,
            borderRightColor: "#585858CC",
        };
    }
    return (
        <Pressable
            key={lang}
            disabled={IS_SELECTED}
            onPress={() => setLang(lang)}
            style={borderStyle}
            className={`w-1/3 items-center px-2 gap-3`}
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
                <Text className="text-primaryBlue text-center font-publicsans uppercase text-lg font-bold mb-2">
                    {LANG.asString(lang).toUpperCase()}
                </Text>
                <Text
                    className={
                        textClass +
                        " text-center font-publicsans font-bold text-sm leading-none mb-1"
                    }
                >
                    {book}
                </Text>
                <Text
                    className={
                        textClass +
                        " pb-2 text-center font-publicsans text-sm leading-none"
                    }
                >
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
