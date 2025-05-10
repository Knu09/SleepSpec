import { Stack } from "expo-router";
import BottomNavigationSheet from "@/components/BottomNavigationSheet";
import { BottomSheetProvider } from "@/components/BottomSheetContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { Screen } = Stack;
const accent = "#006fff";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Screen name="index" options={{ title: "Home" }} />
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
