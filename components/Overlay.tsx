import { ActivityIndicator, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { Href, useRouter } from "expo-router";
import { Process } from "@/types/types";
import { ThemeContext } from "@/context/ThemeContext";

type OverlayProps = {
    heading: string;
    waitMsg?: string;
    state: Process;
    redirect?: Href;
};

export default function Overlay({
    heading,
    waitMsg,
    state,
    redirect,
}: OverlayProps) {
    const router = useRouter();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";

    useEffect(() => {
        if (state == Process.READY && redirect !== undefined) {
            router.push(redirect);
        }
    }, [state, router]);

    // Do not render overlay
    if (state != Process.PENDING) return;

    return (
        <View
            className={bgClass + " flex justify-center items-center w-full"}
            style={{
                position: "absolute",
                top: 80,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
            }}
        >
            <View className="flex items-center gap-2">
                <Text className="text-primaryBlue text-2xl font-medium">
                    {heading}
                </Text>
                <Text className={textClass + " mb-8 text-lg"}>
                    {waitMsg || "Please wait for a moment..."}
                </Text>
                <ActivityIndicator size={60} color={"#006fff"} />
            </View>
        </View>
    );
}
