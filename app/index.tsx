import { Route } from "expo-router/build/Route";
import "../global.css";
import {
    StyleSheet,
    StatusBar,
    Pressable,
    View,
    ScrollView,
    Button,
    Image,
    Text,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
// import MaskedView from "@react-native-masked-view/masked-view";
// import { LinearGradient } from "expo-linear-gradient";

// import { COLORS, icons, images, SIZES } from '../contants';

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    flex: 1,
                }}
            >
                {/* <MaskedView */}
                {/*     maskElement={<Text style={styles.title}>SleepSpec.</Text>} */}
                {/* > */}
                {/*     <LinearGradient */}
                {/*         colors={["#006EFF", "#7800D3"]} */}
                {/*         style={styles.gradient} */}
                {/*     /> */}
                {/* </MaskedView> */}
                <View>
                    <Text style={[styles.title, styles.textalignCenter]}>
                        SleepSpec.
                    </Text>
                    <Text style={styles.subtitle}>
                        Sleep Deprivation Detection using SVM
                    </Text>
                </View>
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Pressable onPress={() => console.log("Pressed")}>
                        <Text style={styles.text}>Select language</Text>
                        <View style={styles.row}>
                            <Image
                                source={require("../assets/images/philippines 1.png")}
                            />
                            <Text style={styles.text}>Filipino</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#01000F",
        alignItems: "center",
        color: "white",
        textAlign: "center",
    },

    textalignCenter: {
        textAlign: "center",
    },

    text: {
        color: "white",
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
    },

    subtitle: {
        fontSize: 38,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    gradient: { flex: 1 },

    row: {
        flexDirection: "row",
        marginTop: 5,
        alignItems: "center",
    },
});
