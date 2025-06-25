import { FlatList, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import { useClassStore } from "@/store/store";
import { CLASS } from "@/types/types";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemeContext } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function Analysis() {
    const { result } = useClassStore();
    const router = useRouter();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!result) {
        console.error("No Results Found!");
        router.back();
        return null;
    }

    const advices = CLASS.getAdvices(result);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className={bgClass + " flex-1"}>
            <Header title={"Analysis"} back={true} menu={true} />
            <View className="my-5 px-3 flex-1 relative pb-28">
                <View
                    className={
                        (isDark ? "bg-darkBg" : "bg-white") +
                        " px-4 py-6 rounded-3xl"
                    }
                    style={styles.shadowBox}
                >
                    <View className="flex justify-center items-center text-center">
                        <Text className={textClass + " font-publicsans"}>
                            You are
                        </Text>
                        <Text
                            style={{ color: CLASS.getTitleColor(result) }}
                            className="font-publicsans text-2xl font-bold"
                        >
                            {CLASS.getTitle(result)}
                        </Text>
                    </View>

                    <View className="my-6">
                        <LinearGradient
                            colors={["#006EFF", "#7800D3"]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="flex justify-center items-center p-[2px]"
                            style={{
                                borderRadius: 12,
                            }}
                        >
                            <View
                                className={
                                    (isDark ? "bg-darkBg" : "bg-white") +
                                    " w-full rounded-[10px] gap-5 py-3 px-5"
                                }
                            >
                                <View className="flex flex-row justify-between items-center">
                                    <Text
                                        className={
                                            textClass +
                                            " font-publicsans text-lg font-bold"
                                        }
                                    >
                                        Detection Logs
                                    </Text>
                                    <FontAwesome6
                                        size={15}
                                        className="text-center"
                                        width={15}
                                        name={"circle-info"}
                                        color="#006FFF"
                                    />
                                </View>
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-col gap-3">
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-bold font-publicsans"
                                            }
                                        >
                                            Categories
                                        </Text>
                                        <View className="gap-1">
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                Sleep-deprived
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                Non-Sleep-deprived
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                Avg. Confidence Score
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                Decision Score
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex flex-col gap-3">
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-bold font-publicsans"
                                            }
                                        >
                                            Scores (Overall)
                                        </Text>
                                        <View className="gap-1">
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                {CLASS.toPercent(
                                                    result.sd_prob,
                                                )}
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                {CLASS.toPercent(
                                                    result.nsd_prob,
                                                )}
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                {CLASS.getConfScorePercent(
                                                    result,
                                                )}
                                            </Text>
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
                                                }
                                            >
                                                {result.decision_score.toFixed(
                                                    3,
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View className="gap-6 mb-4">
                        <Text className={textClass + " font-publicsans"}>
                            {advices.summary}
                        </Text>
                    </View>

                    <FlatList
                        data={advices.contents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="mt-2 flex flex-row gap-4">
                                <Text
                                    className={
                                        textClass + " leading-6 font-publicsans"
                                    }
                                >
                                    •
                                </Text>
                                <View className="flex-1">
                                    <Text
                                        className={
                                            textClass +
                                            " font-bold font-publicsans"
                                        }
                                    >
                                        {item.title}:{" "}
                                        <Text
                                            className={
                                                textClass +
                                                " font-normal font-publicsans"
                                            }
                                        >
                                            {item.desc}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>

            <View
                style={{
                    zIndex: 100,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                }}
            >
                <TabNavigation />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shadowBox: {
        elevation: 3,
    },
});
