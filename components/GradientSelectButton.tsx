import { GestureResponderEvent, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

type GradientSelectButtonProps = {
    pressHandler?: (event: GestureResponderEvent) => void;
};

export default function GradientSelectButton({
    pressHandler,
}: GradientSelectButtonProps) {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass =
        currentTheme === "dark" ? "text-secondary" : "text-bgDark";

    return (
        <LinearGradient
            colors={["#006EFF", "#7800D3"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex items-center"
            style={{ borderRadius: 100 }}
        >
            <Pressable
                className={
                    (isDark ? "bg-darkBg" : "bg-white") +
                    " rounded-full m-[1px] gap-4 justify-center px-10"
                }
                style={{ width: 145, height: 45 }}
                onPress={pressHandler}
            >
                <Text
                    className={
                        "font-bold font-publicsans text-center " + textClass
                    }
                >
                    SELECT
                </Text>
            </Pressable>
        </LinearGradient>
    );
}
