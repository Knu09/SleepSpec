import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "@/components/Header";
import Accordion from "@/components/Accordion";
import { ThemeContext } from "@/context/ThemeContext";
import { user_manual } from "@/constants/constant";

export default function UserManual() {
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
    return (
        <SafeAreaView className={bgClass + " text-secondary flex-1"}>
            <Header title={"User Manual"} back={true} menu={true} />
            <ScrollView
                className="flex px-6 mt-5"
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 30,
                }}
            >
                <View className="justify-start items-start text-start gap-2">
                    <Text className={textClass + " font-poppinsBold text-2xl"}>
                        SleepSpec User Manual
                    </Text>
                    <Text
                        className={
                            textClass + " font-publicsans text-sm opacity-80"
                        }
                    >
                        Your Personal Voice-Based Sleep Deprivation Checker
                    </Text>
                </View>
                <View className="gap-5 mb-10">
                    {user_manual.map((manual, index) => (
                        <Accordion
                            key={index.toString()}
                            title={manual.title}
                            description={manual.description}
                            image={manual.image}
                            isOpened={manual.isOpened}
                            {...(manual.list && { list: manual.list })}
                        ></Accordion>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
