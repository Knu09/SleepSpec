import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { Href, useRouter } from "expo-router";
import { Process } from "@/types/types";

type OverlayProps = {
    heading: string;
    waitMsg?: string;
    state: Process;
    redirect?: Href
};

export default function Overlay({ heading, waitMsg, state, redirect }: OverlayProps) {
    const router = useRouter();

    useEffect(() => {
        if (state == Process.READY && redirect !== undefined) {
            router.push(redirect);
        }
    }, [state, router]);

    // Do not render overlay
    if (state != Process.PENDING) return;

    return (
        <View className="flex justify-center items-center pb-28 bg-darkBg w-full" style={{height: '100%'}}>
            <View className="flex items-center gap-2">
                <Text className="text-primaryBlue text-2xl font-medium">{heading}</Text>
                <Text className="text-secondary mb-8 text-lg">
                    {waitMsg || "Please wait for a moment..."}
                </Text>
                <ActivityIndicator size={70} color={"#006fff"} />
            </View>
        </View>
    );
}
