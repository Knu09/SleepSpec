import { Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
export default function GradientSelectButton() {
    return (
        <LinearGradient
            colors={["#006EFF", "#7800D3"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="p-[1.5px] flex items-center"
            style={{ borderRadius: 22, width: 149 }}
        >
            <Pressable
                className="rounded-[22px] gap-4 py-4 px-10 bg-[#01000F]"
                style={{ width: 145 }}
            >
                <Text className="font-bold text-center text-white">SELECT</Text>
            </Pressable>
        </LinearGradient>
    );
}
