import { Stack } from "expo-router";
import { Text } from "react-native";

const { Screen } = Stack;
const accent = "#006fff";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                // headerStyle: {
                //     backgroundColor: "#01000f",
                // },
                // headerTitleStyle: {
                //     color: "#ddd",
                //     fontWeight: 700,
                // },
                // headerTintColor: accent,
                // headerRight: () => <Text className="text-white">Menu</Text>,
                // headerTitleAlign: "center",
            }}
        >
            <Screen name="index" options={{ title: "Home" }} />
            <Screen name="recording" options={{ title: "Recording" }} />
        </Stack>
    );
}
