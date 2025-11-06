import "@/global.css";
import "react-native-gesture-handler";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";

import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import SleepSpecLogo from "@/components/SleepSpecLogo";
import SleepSpecTitle from "@/components/SleepSpecTitle";
import Overlay from "@/components/Overlay";
import { CLASS, Process } from "@/types/types";

SplashScreen.preventAutoHideAsync();

import Header from "@/components/Header";
import LanguageSelected from "@/components/LanguageSelected";
import { ThemeContext } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { uploadAudio } from "@/utils/util";
// import { useWienerFiltering } from "@/context/WienerFilteringContext";
import { useNoiseReduction } from '@/context/NoiseReductionContext';
import { useClassStore, useSegmentStore } from "@/store/store";

export default function Index() {
	const [fontsLoaded] = useFonts({
		"Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
		"Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
		"PublicSans-Regular": require("@/assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
		"PublicSans-Bold": require("@/assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
	});

	const { currentTheme } = useContext(ThemeContext);
	const isDark = currentTheme === "dark";
	const textClass =
		currentTheme === "dark" ? "text-secondary" : "text-bgDark";

	const router = useRouter();

	const navigateTo = (screen: string) => {
		router.push(`/${screen}` as any);
	};

	const { setResult } = useClassStore();
	const { syncSegments } = useSegmentStore();
	// const { wienerFiltering } = useWienerFiltering();
	const { noiseReductionMethod } = useNoiseReduction();

	const [upload, setUpload] = useState(Process.IDLE);
	const pickAudioFile = async () => {
		const pickerResult = await DocumentPicker.getDocumentAsync({
			type: "audio/*",
			copyToCacheDirectory: true,
		});

		if (!pickerResult.canceled) {
			const uri = pickerResult.assets[0].uri;
			setUpload(Process.PENDING);

			// const result = await uploadAudio(uri, wienerFiltering);
			const result = await uploadAudio(uri, noiseReductionMethod);

			if (!result) {
				setUpload(Process.FAILED);
				console.error("Error processing of file from server.");
				return;
			}

			setUpload(Process.READY);

			setResult(result);
			syncSegments();
		}
	};

	useEffect(() => {
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<SafeAreaView
			className={currentTheme === "dark" ? "bg-darkBg" : "bg-lightBg"}
			style={styles.container}
		>
			<Header userMan={true} menu={true} />
			<ScrollView
				className="px-3 py-5"
				contentContainerStyle={{
					flexGrow: 1,
					alignItems: "center",
					justifyContent: "flex-start",
				}}
			>
				<View
					style={styles.shadowBox}
					className={
						(isDark ? "bg-darkLayer" : "bg-white") +
						" gap-16 rounded-3xl pt-8 pb-6 px-2"
					}
				>
					<View className="flex flex-col items-center">
						<SleepSpecLogo width="110" height="96"></SleepSpecLogo>
						<SleepSpecTitle
							width={218 + 100}
							height={72.5}
						></SleepSpecTitle>
						<Text
							className={
								textClass + " text-center px-5 font-publicsans"
							}
							style={styles.subtitle}
						>
							Mild Sleep Deprivation Detection using SVM
						</Text>
					</View>
					<View className="items-center gap-4">
						<View className="items-center flex-row flex-wrap justify-center px-4">
							<Text
								className={
									textClass +
									" text-base font-publicsans text-center"
								}
							>
								Start{" "}
							</Text>

							<View
								className={
									"flex-row items-center px-4 py-2 rounded-full mx-1 " +
									(isDark
										? "bg-[#35007680]"
										: "bg-[#006FFF23]")
								}
							>
								<Icon
									name="microphone"
									size={16}
									color="#006FFF"
								/>
								<Text className="font-semibold text-primaryBlue ms-1">
									detecting
								</Text>
							</View>
							<Text
								className={
									textClass +
									" text-base font-publicsans text-center"
								}
							>
								mild sleep deprivation{" "}
							</Text>
							<Text
								className={
									textClass +
									" text-base font-publicsans text-center"
								}
							>
								by clicking the microphone below.
							</Text>
						</View>
						<View
							style={{
								borderRadius: 15,
								elevation: 3,
							}}
						>
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={() => navigateTo("select_language")}
							>
								<LinearGradient
									colors={["#006EFF", "#7800D3"]}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									className="flex justify-center items-center"
									style={{
										padding: 1,
										borderRadius: 15,
									}}
								>
									<View
										className={
											"rounded-[15px] items-center py-3 px-4 " +
											(isDark ? "bg-darkBg" : "bg-white")
										}
										style={
											(styles.button, { elevation: 6 })
										}
									>
										<Text
											className={
												textClass +
												" font-bold font-publicsans mb-2"
											}
										>
											Select a speech script language
										</Text>
										<LanguageSelected />
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View className="flex w-full flex-1 items-center justify-center gap-2">
					<View className="flex flex-row w-full justify-evenly items-center">
						{/* Settings button */}
						<View className="flex gap-2 items-center -mb-6">
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={() => {
									navigateTo("settings");
								}}
							>
								<LinearGradient
									colors={["#006EFF", "#7800D3"]}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									className="justify-center items-center p-[1.25px]"
									style={styles.linearGradientMicrophone}
								>
									<View
										className={
											(isDark
												? "bg-darkBg"
												: "bg-white") +
											" w-14 h-14 flex justify-center items-center rounded-full"
										}
										style={{
											elevation: 6,
											shadowColor: "#000",
										}}
									>
										<MaterialIcons
											name="settings"
											size={26}
											color="#006FFF"
										/>
									</View>
								</LinearGradient>
							</TouchableOpacity>
							<Text
								className={
									textClass + " opacity-80 font-publicsans"
								}
							>
								Settings
							</Text>
						</View>
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() => navigateTo("recording")}
						>
							<LinearGradient
								colors={["#006EFF", "#7800D3"]}
								start={{ x: 0.5, y: 0 }}
								end={{ x: 0.5, y: 1 }}
								className="justify-center items-center p-[2px]"
								style={styles.linearGradientMicrophone}
							>
								<View
									style={styles.shadowProp}
									className={
										(isDark ? "bg-darkBg" : "bg-white") +
										" w-40 h-40 flex justify-center items-center rounded-full"
									}
								>
									<MaskedView
										maskElement={
											<Icon
												name="microphone"
												size={60}
												color="black"
											/>
										}
									>
										<LinearGradient
											colors={["#006FFF", "#7800D3"]}
											start={{ x: 0.5, y: 0 }}
											end={{ x: 0.5, y: 1 }}
											style={{ width: 40, height: 60 }}
										/>
									</MaskedView>
								</View>
							</LinearGradient>
						</TouchableOpacity>

						{/* Audio Upload button */}
						<View className="flex gap-2 items-center -mb-6">
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={pickAudioFile}
							>
								<LinearGradient
									colors={["#006EFF", "#7800D3"]}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									className="justify-center items-center p-[1.25px]"
									style={styles.linearGradientMicrophone}
								>
									<View
										className={
											(isDark
												? "bg-darkBg"
												: "bg-white") +
											" w-14 h-14 flex justify-center items-center rounded-full"
										}
										style={{
											elevation: 6,
											shadowColor: "#000",
										}}
									>
										<MaterialIcons
											name="upload-file"
											size={26}
											color="#006FFF"
										/>
									</View>
								</LinearGradient>
							</TouchableOpacity>
							<Text
								className={
									textClass +
									" opacity-80 font-publicsans text-center"
								}
							>
								Upload
							</Text>
						</View>
					</View>
					<View className="w-64 pt-2">
						<Text className="text-primaryBlue font-publicsans font-bold text-xl text-center">
							Record
						</Text>
						<Text
							className={
								textClass +
								" font-publicsans text-center opacity-80"
							}
						>
							Click the microphone to record, or upload your
							voice.
						</Text>
					</View>
				</View>
			</ScrollView>

			<Overlay heading="Processing" state={upload} redirect="/analysis" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {},

	container: {
		flex: 1,
		alignItems: "center",
		// color: "white",
		textAlign: "center",
	},

	subtitle: {
		marginTop: 4,
		fontSize: 13.5,
	},

	linearGradientMicrophone: {
		borderRadius: 100,
	},

	gradient: { flex: 1 },

	row: {
		flexDirection: "row",
		marginTop: 5,
		alignItems: "center",
	},
	shadowBox: {
		elevation: 3,
	},
	shadowProp: {
		elevation: 10,
		shadowColor: "#000",
	},
});
