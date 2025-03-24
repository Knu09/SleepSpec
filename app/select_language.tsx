import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "react-native";
import GradientSelectButton from "@/components/GradientSelectButton";
import { Image } from "expo-image";

enum ID {
    ENGLISH = 1,
    FILIPINO = 2
}

interface LangChoiceProps {
    id: number;
    src: NodeJS.Require;
    name: string;
}

export default function SelectLanguage() {
    return (
        <SafeAreaView className="bg-[#01000f]" style={{ flex: 1 }}>
            <View className="px-6">
                <Header title="Select Language" back={true} menu={true} />
            </View>

            <View style={{ flex: 1 }} className="flex flex-row gap-20 mt-7 items-center justify-center">
                {languages.map(LangChoice)}
            </View>

            <View className="border border-t-gray-600 pt-[2.5rem] pb-[1.2rem] items-center">
                <GradientSelectButton />
            </View>
        </SafeAreaView>
    );
}

function LangChoice({ id, src, name }: LangChoiceProps) {
    return (
        <Pressable key={id} className="items-center">
            <Image style={{ width: 90, aspectRatio: 1 }} source={src} />
            <Text className="text-white text-xl font-bold">{name}</Text>
        </Pressable>
    )
}

const languages: LangChoiceProps[] = [
    {
        id: ID.ENGLISH,
        src: require("@/assets/images/flag-us.svg"),
        name: "English"
    },
    {
        id: ID.FILIPINO,
        src: require("@/assets/images/flag-ph.svg"),
        name: "Filipino"
    },
]
