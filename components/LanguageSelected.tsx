import { Text, View } from "react-native";
import { Image } from "expo-image";
import { LANG } from "@/types/types";
import { useLangStore } from "@/store/store";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

export default function LanguageSelected() {
    const { currentLang: lang } = useLangStore();
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    return (
        <View className="flex flex-row gap-2 items-center">
            <Image
                source={LANG.asImg(lang)}
                style={{ width: 25, aspectRatio: 1 }}
            />
            <View className="gap-1">
                <Text className={textClass + " font-publicsans leading-none"}>
                    {LANG.asString(lang)}
                </Text>
                <Text
                    className={
                        textClass +
                        " text-sm font-light opacity-80 font-publicsansLight leading-none"
                    }
                >
                    {LANG.getBookTitle(lang)}
                </Text>
            </View>
        </View>
    );
}
