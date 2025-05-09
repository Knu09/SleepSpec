import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "@/components/Header";
import Accordion from "@/components/Accordion";

export default function UserManual() {
    const user_manual = [
        {
            title: "Welcome to SleepSpec!",
            description:
                "SleepSpec is a mobile application that helps you check for signs of sleep deprivation based on your voice. It's easy to use and only takes a few minutes to process.",
            image: "",
            isOpened: true,
        },

        {
            title: "Home",
            description:
                "When you open the app, you will see two main buttons:",
            list: {
                type: "bullet",
                items: [
                    {
                        title: "Start Test",
                        description:
                            "Choose the language you want to speak in.",
                    },
                    {
                        title: "Microphone",
                        description:
                            "Takes you to the Recording Page to start voice recording.",
                    },
                ],
            },
            image: "home_guide.png",
            isOpened: true,
        },
    ];

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
        <SafeAreaView className="bg-darkBg text-secondary flex-1">
            <Header title={"User Manual"} back={true} menu={true} />
            <ScrollView
                className="flex px-6 mt-5"
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 30,
                }}
            >
                <View className="justify-start items-start text-start gap-2">
                    <Text className="text-secondary font-poppinsBold text-2xl">
                        SleepSpec User Manual
                    </Text>
                    <Text className="text-secondary/80 font-publicsans text-sm">
                        Your Personal Voice-Based Sleep Deprivation Checker
                    </Text>
                </View>
                <View className="gap-5">
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
