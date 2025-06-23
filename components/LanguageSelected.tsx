import { Text, View } from "react-native";
import { Image } from "expo-image";
import { LANG } from "@/types/types";
import { useLangStore } from "@/store/store";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function LanguageSelected() {
    const { currentLang: lang } = useLangStore();
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    return (
        <View className="flex flex-row text pl-[2px]">
            <Image
                source={LANG.asImg(lang)}
                style={{ width: 25, aspectRatio: 1, marginRight: 6 }}
            />
            <Text
                className={textClass + " text-lg font-normal font-publicsans"}
            >
                {LANG.asString(lang)}
            </Text>
        </View>
    );
}
