import { ActivityIndicator, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { Href, useRouter } from "expo-router";
import { Process } from "@/types/types";
import { ThemeContext } from "@/context/ThemeContext";
import { useTimer } from "@/context/TimerContext";

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
    const { startTimer, stopTimer, resetTimer, elapsedTime } = useTimer();
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";

    useEffect(() => {
        if (state == Process.READY && redirect !== undefined) {
            router.push(redirect);
        }
    }, [state, router]);

    // Format elapsed time (mm:ss)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (state === Process.PENDING) {
            resetTimer();
            startTimer();
        } else if (state === Process.READY) {
            stopTimer();
            if (redirect) router.push(redirect);
        }
    }, [state]);

    // Do not render overlay
    if (state != Process.PENDING) return null;

    return (
        <View
            className={bgClass + ""}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 500,
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
                <Text className="font-poppinsRegular text-black">
                    {formatTime(elapsedTime)}
                </Text>
            </View>
        </View>
    );
}
