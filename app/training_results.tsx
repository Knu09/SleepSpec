import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "@/components/Header";
import Accordion from "@/components/Accordion";

export default function TrainingResults() {
    const training_results = [
        {
            title: "Accuracy",
            description:
                "The SVM model achieved an average accuracy of 79.10%, reveal the reliable classification performance across 20 fold of data. Pre-test and post-test accuracy values were always close to 80.00% and 79.70%, respectively, reflecting the vast generalization ability of the model even in differentiating individual non-sleep-deprived and sleep-deprived subjects. The results are an indication of the model being effective in reflecting vocal variations during various sleep conditions in a well-balanced manner in various test splits.",
            image: "",
            isOpened: true,
        },

        {
            title: "AUC-ROC Curve",
            description:
                "The figure below shows the performance metrics of how well a binary classifier distinguishes between two classes (pre-session vs. post-session). Notably, the feature dimension frequency-scale has the highest AUC of 0.95 (1.0 - 0.05), which is closer to 1.0, indicating an excellent separation between classes (See Figure 4). The second feature dimension with the high AUC is the combined features (Strf) with an AUC of 0.86, which is also within the very good range from Figure 4. The third feature dimension that aligns the value of AUC in combined features is the frequency-rate has a very good with an AUC of 0.85. While the scale-rate, performs a satisfactory that lies with an AUC of 0.70. Overall, the frequency-scale performs an excellent feature for the SVM classifier.",
            image: require("./../assets/images/roc_curve_all_dimensions.png"),
            isOpened: false,
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
            <Header title={"Training Results"} back={true} menu={true} />
            <ScrollView
                className="flex px-6 mt-5"
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 30,
                }}
            >
                <View className="justify-start items-start text-start gap-2">
                    <Text className="text-secondary font-poppinsBold text-2xl">
                        SleepSpec Training Results
                    </Text>
                    <Text className="text-secondary/80 font-publicsans text-sm">
                        Training Results of SVM on Sleep Deprivation Dataset
                    </Text>
                </View>
                <View className="gap-5">
                    {training_results.map((manual, index) => (
                        <Accordion
                            key={index.toString()}
                            title={manual.title}
                            description={manual.description}
                            image={manual.image}
                            isOpened={manual.isOpened}
                        ></Accordion>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
