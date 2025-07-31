import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "@/components/Header";
import Accordion from "@/components/Accordion";
import MetricCard from "@/components/MetricCard";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { training_results } from "@/constants/constant";

export default function TrainingResults() {
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

    return (
        <SafeAreaView
            className={`${isDark ? "bg-darkBg" : "bg-lightBg"} flex-1`}
        >
            <Header title={"About the Model"} back={true} menu={true} />
            <ScrollView
                className="flex px-6 py-5"
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 16,
                }}
            >
                {/* header section */}
                <View className="justify-start items-start text-start gap-2">
                    <Text className={`${textClass} font-poppinsBold text-2xl`}>
                        SleepSpec Model
                    </Text>
                    <Text
                        className={`${textClass} opacity-80 font-publicsans text-sm`}
                    >
                        The SleepSpec mobile application utilizes a{" "}
                        <Text className="font-bold">
                            {" "}
                            Support Vector Machine (SVM){" "}
                        </Text>
                        classifier to detect mild sleep deprivation based on
                        vocal biomarkers. The model operates on{" "}
                        <Text className="font-bold">
                            spectro-temporal modulation (STM){" "}
                        </Text>
                        features extracted from user-recorded voice samples.
                        These features reflect modulation energy patterns across
                        three auditory dimensions:{" "}
                        <Text className="font-bold">
                            {" "}
                            Frequency, Rate, and Scale
                        </Text>
                        .
                    </Text>
                    <Text
                        className={`${textClass} opacity-80 font-publicsans text-sm`}
                    >
                        The audio input is segmented into 15-second intervals,
                        resampled 44.1 kHz to 16 kHz, and converted into STM
                        representations. These high-dimensional feature vectors
                        are then classified using a trained SVM model with an
                        RBF kernel, optimized through cross-validation. The
                        system outputs a{" "}
                        <Text className="font-bold">
                            binary classification—Sleep-Deprived or
                            Non-Sleep-Deprived
                        </Text>
                        —along with a confidence score derived from the model’s
                        decision function.
                    </Text>
                </View>
                <View className="justify-start items-start text-start gap-2">
                    <Text className={`${textClass} font-poppinsBold text-2xl`}>
                        SleepSpec Training Results
                    </Text>
                    <Text
                        className={`${textClass} opacity-80 font-publicsans text-sm`}
                    >
                        The model was evaluated using metrics such as{" "}
                        <Text className="font-bold">
                            Balanced Accuracy (BAcc), Precision, Recall, and F1
                            Score
                        </Text>
                        , demonstrating consistent and robust performance in
                        distinguishing between before and after mild sleep
                        deprivation.
                    </Text>
                </View>

                {/* metric section */}
                <View className="-mx-6 relative">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                        className="flex-row py-3"
                        style={{
                            paddingHorizontal: 24,
                            // borderWidth: 0.75,
                            // borderColor: "#585858",
                            // borderRadius: 6,
                        }}
                    >
                        <MetricCard value={85.9} label="Balanced Accuracy" />
                        <MetricCard
                            value={85.88}
                            label="Accuracy"
                            color="#38BDF8"
                        />
                        <MetricCard
                            value={85.9}
                            label="Precision"
                            color="#FBBF24"
                        />
                        <MetricCard
                            value={85.88}
                            label="Recall"
                            color="#F87171"
                        />
                        <MetricCard
                            value={85.88}
                            label="F1-Score"
                            color="#A78BFA"
                        />
                        <View style={{ width: 34 }}></View>
                    </ScrollView>

                    {/* Left Gradient */}
                    <LinearGradient
                        colors={[sideGradientColor, "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 50,
                            zIndex: 1000,
                        }}
                        pointerEvents="none"
                    />
                    {/* Right Gradient */}
                    <LinearGradient
                        colors={["transparent", sideGradientColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 50,
                            zIndex: 1000,
                        }}
                        pointerEvents="none"
                    />
                </View>

                <View className="justify-start items-start text-start gap-2">
                    <Text className={`${textClass} font-poppinsBold text-2xl`}>
                        Detailed Descriptions
                    </Text>
                </View>

                {/* accordion sections */}
                <View className="mb-4">
                    <View className="gap-5">
                        {training_results.map((manual, index) => (
                            <Accordion
                                key={index.toString()}
                                title={manual.title}
                                description={manual.description}
                                image={manual.image}
                                isOpened={manual.isOpened}
                            />
                        ))}
                    </View>
                </View>
                <View className="pb-12">
                    <Text
                        className={`${textClass} opacity-80 font-publicsans text-sm text-center`}
                    >
                        All test results is performed locally on-device,
                        ensuring data privacy and responsiveness.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        minWidth: 250,
        backgroundColor: "#1E1E2E",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
