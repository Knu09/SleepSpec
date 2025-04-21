import { Text, Pressable, GestureResponderEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GradientSelectButtonProps = {
    pressHandler?: (event: GestureResponderEvent) => void;
};

export default function GradientSelectButton({
    pressHandler,
}: GradientSelectButtonProps) {
    return (
        <LinearGradient
            colors={["#006EFF", "#7800D3"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex items-center"
            style={{ borderRadius: 100 }}
        >
            <Pressable
                className="rounded-full m-[1px] gap-4 py-4 px-10 bg-[#01000F]"
                style={{ width: 145 }}
                onPress={pressHandler}
            >
                <Text className="font-bold text-center text-white">SELECT</Text>
            </Pressable>
        </LinearGradient>
    );
}
