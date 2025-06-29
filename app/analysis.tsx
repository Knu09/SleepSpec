import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import { useClassStore } from "@/store/store";
import { CLASS } from "@/types/types";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { ThemeContext } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function Analysis() {
    const { result } = useClassStore();
    const router = useRouter();

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const borderColor = isDark ? "#006FFF" : "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const bottomStopColor = isDark ? "#7800D3" : "#01000F";
    const TabBackgroundColor = isDark ? "#01000F" : "#FFF";
    const headerColor = isDark ? "bg-arsenic" : "bg-grayLayer";

    const [modalVisible, setModalVisible] = useState(false);

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
                        (isDark ? "bg-darkLayer" : "bg-white") +
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
                        <View className="gap-6 mb-4">
                            <Text
                                className={
                                    textClass + " text-sm font-publicsans"
                                }
                            >
                                {advices.summary}
                            </Text>
                        </View>

                        <FlatList
                            data={advices.contents}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View className="flex flex-row gap-4">
                                    <Text
                                        className={
                                            textClass +
                                            " text-sm font-publicsans"
                                        }
                                    >
                                        •
                                    </Text>
                                    <View className="flex-1">
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-bold font-publicsans"
                                            }
                                        >
                                            {item.title}:{" "}
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-sm font-normal font-publicsans"
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

                    <View className="">
                        {/* <LinearGradient */}
                        {/*     colors={[topStopColor, bottomStopColor]} */}
                        {/*     start={{ x: 0.5, y: 0 }} */}
                        {/*     end={{ x: 0.5, y: 1 }} */}
                        {/*     className="flex justify-center items-center p-[1.4px]" */}
                        {/*     style={{ */}
                        {/*         borderRadius: 12, */}
                        {/*     }} */}
                        {/* > */}
                        <View
                            className={
                                (isDark ? "bg-darkBg" : "bg-white") +
                                " w-full rounded-[12px] gap-3"
                            }
                            style={{
                                borderWidth: 0.75,
                                borderColor: "#585858",
                            }}
                        >
                            <View
                                style={{
                                    borderTopRightRadius: 12,
                                    borderTopLeftRadius: 12,
                                    borderBottomColor: "#585858",
                                    borderBottomWidth: 0.75,
                                }}
                                className={
                                    headerColor +
                                    " flex flex-row justify-between items-center py-1 px-5"
                                }
                            >
                                <Text
                                    className={
                                        textClass + " font-publicsans font-bold"
                                    }
                                >
                                    Detection Logs
                                </Text>
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={() => setModalVisible(true)}
                                >
                                    <FontAwesome6
                                        size={15}
                                        className="text-center"
                                        width={15}
                                        name={"circle-info"}
                                        color="#006FFF"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View className=" flex flex-row justify-between px-5 pb-2">
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
                                            {CLASS.toPercent(result.sd_prob)}
                                        </Text>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans"
                                            }
                                        >
                                            {CLASS.toPercent(result.nsd_prob)}
                                        </Text>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans"
                                            }
                                        >
                                            {CLASS.getConfScorePercent(result)}
                                        </Text>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans"
                                            }
                                        >
                                            {result.decision_score.toFixed(3)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* </LinearGradient> */}
                    </View>

                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                    >
                        <View
                            className="flex-1 justify-center items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.5)",
                                paddingTop: StatusBar.currentHeight,
                            }}
                        >
                            <View className="mx-3 p-4 bg-white rounded-lg">
                                <View className="flex flex-row justify-between items-center">
                                    <Text className=" font-bold font-publicsans">
                                        What is Detection Logs?
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <AntDesign
                                            name="close"
                                            size={18}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    className={
                                        textClass +
                                        " text-sm font-normal font-publicsans mt-2"
                                    }
                                >
                                    SleepSpec uses this information to estimate
                                    how sleep-deprived or non-sleep-deprived you
                                    are and gives you a confidence score for
                                    better understanding.
                                </Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>

            <View
                style={{
                    zIndex: 100,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: TabBackgroundColor,
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
