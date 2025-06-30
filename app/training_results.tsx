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

export default function TrainingResults() {
	const training_results = [
		{
			title: "Test BAcc",
			description:
				"Balanced Accuracy (BAcc) is like a fair judge — it looks at how well the model performs across all classes, especially when things aren’t evenly split. A score of 75% means it did a good job telling apart sleep-deprived and non-sleep-deprived voices overall.",
			image: "",
			isOpened: true,
		},
		{
			title: "Test Accuracy",
			description:
				"This is the percentage of times the model got it right. At 74.9%, it means that almost 3 out of 4 times, the system correctly identified whether someone was sleep-deprived or not.",
			image: "",
			isOpened: false,
		},
		{
			title: "Test Precision",
			description:
				"Precision tells us how many times the model was right when it said someone was sleep-deprived. At 75.2%, it means most of the time, when the system raised a flag, it was for a good reason.",
			image: "",
			isOpened: false,
		},
		{
			title: "Test Recall",
			description:
				"Recall measures how well the system catches actual cases of sleep deprivation. With a 74.5% score, it means it successfully found most of the people who were really sleep-deprived.",
			image: "",
			isOpened: false,
		},
		{
			title: "Test F1-Score",
			description:
				"The F1-Score balances both precision and recall. A 74.8% score means the system isn’t just accurate — it’s also consistent in catching sleep deprivation without crying wolf too often.",
			image: "",
			isOpened: false,
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

	const { currentTheme } = useContext(ThemeContext);
	const isDark = currentTheme === "dark";
	const textClass = isDark ? "text-secondary" : "text-bgDark";

	return (
		<SafeAreaView
			className={`${isDark ? "bg-darkBg" : "bg-lightBg"} flex-1`}
		>
			<Header title={"Training Results"} back={true} menu={true} />
			<ScrollView
				className="flex px-6 mt-5"
				contentContainerStyle={{
					flexGrow: 1,
					gap: 30,
				}}
			>
				{/* header section */}
				<View className="justify-start items-start text-start gap-2">
					<Text className={`${textClass} font-poppinsBold text-2xl`}>
						SleepSpec Training Results
					</Text>
					<Text className={`${textClass}/80 font-publicsans text-sm`}>
						Training Results of SVM on Sleep Deprivation Dataset
					</Text>
				</View>

				{/* metric section */}
				<View className="mb-1">
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 12, paddingRight: 16 }}
						className="flex-row"
					>
						<MetricCard value={75} label="Test BAcc" />
						<MetricCard
							value={74.9}
							label="Test Accuracy"
							color="#38BDF8"
						/>
						<MetricCard
							value={75.2}
							label="Test Precision"
							color="#FBBF24"
						/>
						<MetricCard
							value={74.5}
							label="Test Recall"
							color="#F87171"
						/>
						<MetricCard
							value={74.8}
							label="Test F1-Score"
							color="#A78BFA"
						/>
					</ScrollView>
				</View>

				<View className="justify-start items-start text-start gap-2">
					<Text className={`${textClass} font-poppinsBold text-2xl`}>
						Detailed Descriptions
					</Text>
				</View>

				{/* accordion sections */}
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
