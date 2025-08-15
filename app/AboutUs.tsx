import Header from "@/components/Header";
import { ThemeContext } from "@/context/ThemeContext";
import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen } from "expo-router";
import { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutUs() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-bgDark";
    const sideGradientColor = isDark ? "#01000F" : "#F1F5FD";
    const teamLogo = isDark
        ? require("../assets/images/16KHz Labs.png")
        : require("../assets/images/16KHz-labs-dark.png");
    return (
        <SafeAreaView
            className={`${isDark ? "bg-darkBg" : "bg-lightBg"} flex-1`}
        >
            <Header title={"About Us"} back={true} menu={true} />

            <ScrollView
                className="flex px-6 py-5"
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 16,
                }}
            >
                <View className="flex justify-center items-start gap-4">
                    <Text
                        className={
                            textClass + " font-poppinsBold text-2xl text-start"
                        }
                    >
                        {/* Meet the Team */}
                        Driven by Innovation.{"\n"}
                        United by Purpose.
                    </Text>
                    <View>
                        <Text
                            className={
                                textClass + " font-publicsans opacity-80"
                            }
                        >
                            we are the
                        </Text>
                        <Image
                            source={teamLogo}
                            contentFit="contain"
                            style={{ width: 88, height: 60 }}
                        ></Image>
                        <Text
                            className={
                                textClass +
                                " font-publicsans opacity-80 leading-6"
                            }
                        >
                            A computer science student in University of Negros
                            Occidental - Recoletos. Introduces SleepSpec — a
                            research-based mobile application developed as part
                            of our college thesis — combining artificial
                            intelligence and voice analysis to address the
                            growing concern of{" "}
                            <MaskedView
                                maskElement={
                                    <Text className="font-bold font-publicsans text-black">
                                        Sustainable Development Goals 3
                                    </Text>
                                }
                            >
                                <LinearGradient
                                    colors={["#00B935", "#F8C408"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text
                                        style={{
                                            opacity: 0,
                                        }}
                                    >
                                        Sustainable Development Goals 3
                                    </Text>
                                </LinearGradient>
                            </MaskedView>
                            , also known as "Good Health and Well-being".
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
