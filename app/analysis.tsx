import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableHighlight,
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
import { BlurView } from "expo-blur";
import Card from "@/components/Card";
import { ScrollView } from "react-native-gesture-handler";

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
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";

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
            <ScrollView className="pt-5 px-3 flex-1 relative">
                <View
                    className={
                        (isDark ? "bg-darkLayer" : "bg-white") +
                        " px-4 py-6 rounded-3xl gap-6"
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

                    {/* Prediction Statistics */}
                    <View className="">
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
                                    " flex flex-row justify-between items-center py-1 ps-5 pe-3"
                                }
                            >
                                <Text
                                    className={
                                        textClass + " font-publicsans font-bold"
                                    }
                                >
                                    Prediction Statistics
                                </Text>
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={() => setModalVisible(true)}
                                >
                                    <FontAwesome6
                                        size={17}
                                        className="text-center"
                                        width={17}
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
                    </View>
                    <View className="">
                        <View className="gap-6 mb-4">
                            <Text
                                className={
                                    textClass + " text-sm font-publicsans"
                                }
                            >
                                {advices.summary}
                            </Text>
                        </View>
                        {advices.contents.map((item, index) => (
                            <View
                                className="flex flex-row gap-2 mb-2"
                                key={index}
                            >
                                <Text
                                    className={
                                        textClass + " text-sm font-publicsans"
                                    }
                                >
                                    {"\u25CF"}
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
                        ))}
                    </View>

                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                    >
                        <BlurView
                            intensity={100}
                            tint="dark"
                            className="flex-1"
                        >
                            <View
                                className="flex-1 justify-center items-center"
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                }}
                            >
                                <View
                                    className={
                                        modalColor +
                                        " mx-3 p-4 rounded-lg gap-4"
                                    }
                                >
                                    <View className="flex flex-row justify-between items-center">
                                        <Text
                                            className={
                                                textClass +
                                                " font-bold font-publicsans"
                                            }
                                        >
                                            What are the Prediction Statistics?
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                setModalVisible(false)
                                            }
                                        >
                                            <AntDesign
                                                name="close"
                                                size={18}
                                                color={
                                                    isDark ? "white" : "black"
                                                }
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans"
                                            }
                                        >
                                            SleepSpec uses your voice to check
                                            for signs of mild sleep deprivation.
                                            The{" "}
                                            <Text className="font-bold">
                                                Prediction Statistics
                                            </Text>{" "}
                                            show how likely it is that you're
                                            sleep-deprived or not
                                            sleep-deprived, based on the way you
                                            speak.
                                        </Text>
                                        <Text
                                            className={
                                                textClass +
                                                " text-sm font-normal font-publicsans mt-2"
                                            }
                                        >
                                            Each category comes with a{" "}
                                            <Text className="font-bold">
                                                confidence score
                                            </Text>
                                            , which tells you how sure the
                                            system is about the result. The{" "}
                                            <Text className="font-bold">
                                                decision score
                                            </Text>{" "}
                                            reflects the strongest evidence from
                                            your voice that influenced the final
                                            result.
                                        </Text>
                                    </View>
                                    <View className="mt-4">
                                        <TouchableHighlight
                                            className="flex w-full rounded-md py-3"
                                            style={{
                                                backgroundColor: isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.1)",
                                            }}
                                            underlayColor={
                                                isDark
                                                    ? "rgba(255,255,255,0.2)"
                                                    : "rgba(0,0,0,0.2)"
                                            }
                                            onPress={() =>
                                                setModalVisible(false)
                                            }
                                        >
                                            <Text
                                                className={
                                                    textClass +
                                                    " text-center font-publicsans font-bold"
                                                }
                                            >
                                                Close
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </BlurView>
                    </Modal>
                </View>

                <View className="mt-5 mb-32">
                    <Text
                        className={textClass + " font-poppins font-bold mb-2"}
                    >
                        References
                    </Text>
                    <View className="gap-3">
                        <Card
                            title="8 things doctors wish patients knew about sleep habits"
                            desc="What people do throughout the day—especially before bedtime—can play a major role on their sleeping patterns by promoting healthy sleep or contributing to sleeplessness."
                            url="https://www.ama-assn.org/delivering-care/public-health/8-things-doctors-wish-patients-knew-about-healthy-sleep-habits?utm_source=chatgpt.com"
                        />
                        <Card
                            title="Sleep Deprivation"
                            desc="Sleep deprivation is when you aren’t sleeping enough, or you aren’t getting good, quality sleep."
                            url="https://my.clevelandclinic.org/health/diseases/23970-sleep-deprivation"
                        />
                    </View>
                </View>
            </ScrollView>

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
