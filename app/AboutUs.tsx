import Header from "@/components/Header";
import { ThemeContext } from "@/context/ThemeContext";
import { Feather, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen } from "expo-router";
import { useContext, useEffect } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TeamCard from "@/components/TeamCard";

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

    const navigateToSite = (url: string) => {
        Linking.openURL(url);
    };
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
                <View className="flex justify-center items-start gap-3">
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
                                " font-publicsans opacity-80 leading-6 text-justify"
                            }
                        >
                            A computer science student in University of Negros
                            Occidental - Recoletos. Introduces SleepSpec — a
                            research-based mobile application developed as part
                            of our college thesis — combining artificial
                            intelligence and voice analysis to address the
                            growing concern of{" "}
                            <Text className="font-publicsansBold text-[#4C9F38]">
                                Sustainable Development Goals 3
                            </Text>
                            , also known as "Good Health and Well-being".
                        </Text>
                    </View>

                    <View className="flex-col w-full gap-2 mt-2 mb-20">
                        {/* <Text */}
                        {/*     className={ */}
                        {/*         textClass + */}
                        {/*         " font-poppinsBold text-2xl text-start" */}
                        {/*     } */}
                        {/* > */}
                        {/*     The Team Behind Innovation. */}
                        {/* </Text> */}
                        <TeamCard
                            name="ARANETA, GIAN FRANS D."
                            role="Data Analyst"
                            email="aranetagian.f@gmail.com"
                            github="https://github.com/GizakiF"
                            textClass={textClass}
                            navigateToSite={navigateToSite}
                        />

                        <TeamCard
                            name="DE LA TORRE, CHRISTIAN L."
                            role="Team Leader"
                            email="christiandelatorre2018@gmail.com"
                            github="https://github.com/Knu09"
                            portfolio="https://knu09.github.io/v2.christiandelatorre/"
                            textClass={textClass}
                            navigateToSite={navigateToSite}
                        />

                        <TeamCard
                            name="MEDEL, RAFAEL JACOV C."
                            role="Technical Analyst"
                            email="medelrafjac@gmail.com"
                            github="https://github.com/rafaeljacov"
                            textClass={textClass}
                            navigateToSite={navigateToSite}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
