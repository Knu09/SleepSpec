import { Route } from "expo-router/build/Route";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Hello World! Edit app/index.tsx to edit this screen.</Text>
            <Text> WOrl!</Text>
        </View>
    );
}
