// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import {
    StatusBar,
    setStatusBarBackgroundColor,
    setStatusBarTranslucent,
} from "expo-status-bar";
import BottomNavigationSheet from "@/components/BottomNavigationSheet";
import { BottomSheetProvider } from "../context/BottomSheetContext";
import ThemeProvider, { ThemeContext } from "@/context/ThemeContext";
import { TimerProvider } from "@/context/TimerContext";
import { useContext, useEffect } from "react";
import { NoiseReductionProvider } from "@/context/NoiseReductionContext";
import { Platform } from "react-native";

const { Screen } = Stack;

// Root layout wrapped with ThemeProvider
export default function RootLayout() {
    return (
        <TimerProvider>
            <ThemeProvider>
                <NoiseReductionProvider>
                    <InnerLayout />
                </NoiseReductionProvider>
            </ThemeProvider>
        </TimerProvider>
    );
}

// Context must be used inside the provider
function InnerLayout() {
    const { currentTheme } = useContext(ThemeContext);

    useEffect(() => {
        const bgColor = currentTheme === "dark" ? "#01000F" : "#FFFFFF";

        setStatusBarBackgroundColor(bgColor, true);
    }, [currentTheme]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetProvider>
                <StatusBar
                    style={currentTheme === "dark" ? "light" : "dark"}
                    backgroundColor={
                        currentTheme === "dark" ? "#01000F" : "#FFFFFF"
                    }
                />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "none",
                    }}
                >
                    <Screen name="index" options={{ title: "" }} />
                    <Screen name="recording" options={{ title: "Recording" }} />
                    <Screen
                        name="select_language"
                        options={{ title: "Select Language" }}
                    />
                    <Screen name="analysis" options={{ title: "Analysis" }} />
                    <Screen
                        name="classification"
                        options={{ title: "Classification" }}
                    />
                    <Screen
                        name="feature-analysis"
                        options={{ title: "Feature Analysis" }}
                    />
                </Stack>
                <BottomNavigationSheet />
            </BottomSheetProvider>
        </GestureHandlerRootView>
    );
}
