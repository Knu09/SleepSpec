import { View, Text } from "react-native";
import { Image } from "expo-image";
import { LANG } from "@/types/types";
import { useLangStore } from "@/store/store";

export default function LanguageSelected() {
    const { currentLang: lang } = useLangStore()
    return (
        <View className="flex flex-row text pl-[2px]">
            <Image source={LANG.asImg(lang)} style={{ width: 25, aspectRatio: 1, marginRight: 6 }} />
            <Text className="text-lg text-white font-normal">
                {LANG.asString(lang)}
            </Text>
        </View>
    );
}
