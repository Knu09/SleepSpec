import { View, Text } from "react-native";
import { Image } from "expo-image";
import { LANG } from "@/types/types";
import { useLangStore } from "@/store/store";

export default function LanguageSelected() {
    const lang = useLangStore((state) => state.currentLang)
    return (
        <View className="flex flex-row text gap-[9px] pl-[2px]">
            <Image source={LANG.asImg(lang)} style={{ width: 25, aspectRatio: 1 }} />
            <Text className="text-lg text-white font-normal">
                {LANG.asString(lang)}
            </Text>
        </View>
    );
}
