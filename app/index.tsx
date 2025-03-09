import { Route } from "expo-router/build/Route";
import "@/global.css";
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
import { Stack, useRouter, Link } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
// import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

import Header from "@/components/Header";

const FlagPH = require("@/assets/images/flag-ph.svg");

export default function Index() {
    return (
        <SafeAreaView className="bg-[#01000F]" style={styles.container}>
            <Header title={"Home"} userMan={true} menu={true} />
            <View
                className="mt-10 px-6 flex flex-col justify-center"
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
                    <Text className="text-center text-5xl text-white font-bold">
                        SleepSpec.
                    </Text>
                    <Text className="text-center mt-2 text-2xl text-white font-bold">
                        Sleep Deprition Detection using SVM
                    </Text>
                </View>
                <View className="my-12 items-center gap-6">
                    <View>
                        <Text className="text-white text-center">
                            Start
                            <View className="inline-flex flex-row items-center mx-2 py-2 px-2 bg-[#35007680] rounded-full">
                                <Icon
                                    className="me-2"
                                    name="microphone"
                                    size={20}
                                    color={"#006FFF"}
                                />
                                <Text className="text-primary font-semibold text-[#006FFF]">
                                    detecting
                                </Text>
                            </View>
                            sleep deprivation by clicking the microphone below.
                        </Text>
                    </View>
                    <View>
                        <Pressable
                            className="rounded-3xl items-center py-3 px-10 border border-slate-50"
                            style={styles.button}
                            onPress={() => console.log("Pressed")}
                        >
                            <Text className="font-bold text-white mb-2">
                                Select language
                            </Text>
                            <View className="flex flex-row items-center text gap-2">
                                <Image
                                    source={FlagPH}
                                    style={{ width: 20, height: 20 }}
                                />
                                <Text className="text-white">Filipino</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
                <View className="flex items-center t-10">
                    <LinearGradient
                        colors={["#006EFF", "#7800D3"]}
                        className="rounded-full p-[2px]"
                    >
                        <Link href="/recording" asChild>
                            <View className="w-28 h-28 flex justify-center items-center bg-[#01000F] rounded-full p-4">
                                <Icon
                                    name="microphone"
                                    size={50}
                                    color={"#FFF"}
                                />
                            </View>
                        </Link>
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {},

    container: {
        flex: 1,
        alignItems: "center",
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
