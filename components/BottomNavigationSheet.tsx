import { useEffect, useRef, useCallback } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    TouchableWithoutFeedback,
    Linking,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "../context/BottomSheetContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useClassStore } from "@/store/store";
import {
    Entypo,
    FontAwesome6,
    Foundation,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";

export default function BottomNavigationSheet() {
    const { isVisible, hideBottomSheet } = useBottomSheet();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const router = useRouter();
    const iconColor = "#595F68";

    useEffect(() => {
        if (isVisible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [isVisible]);

    const handleSheetChanges = useCallback(
        (index: number) => {
            console.log(index);
            if (index === -1) {
                hideBottomSheet();
            }
        },
        [hideBottomSheet],
    );

    const navigateTo = (screen: string) => {
        hideBottomSheet();
        router.push(`/${screen}` as any);
        // navigation.navigate(screen as never);
    };

    const navigateToSite = (url: string) => {
        Linking.openURL(url);
    };

    const { result, setResult } = useClassStore();

    if (!isVisible) return null;

    return (
        <>
            <TouchableWithoutFeedback onPress={hideBottomSheet}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                onChange={handleSheetChanges}
                snapPoints={["60%"]}
                handleComponent={() => null}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: "transparent" }}
                style={styles.bottomSheetWrapper}
            >
                <BottomSheetView
                    className="bg-darkLayer"
                    style={styles.bottomsheetContent}
                >
                    <View
                        className="bg-white"
                        style={styles.drawerHolder}
                    ></View>
                    <View
                        className="py-6 px-5 bg-darkLayer border-b-[0.5px]"
                        style={styles.bottomSheetHeader}
                    >
                        <View className="flex flex-row gap-4 items-center">
                            <View className="flex justify-center items-center aspect-square bg-darkBg rounded-lg w-[38px]">
                                <Image
                                    source={require("../assets/images/logo_sleepspec.png")}
                                    contentFit="contain"
                                    style={{ width: 28, height: 18 }}
                                />
                            </View>

                            <View>
                                <Text className="text-secondary font-poppins font-bold text-xl">
                                    SleepSpec
                                </Text>
                                <Text className="text-secondary font-light font-publicsansLight opacity-80 text-sm">
                                    Mild sleep deprivation detection
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="p-5 bg-arsenic gap-4">
                        <View>
                            <TouchableHighlight
                                onPress={() => {
                                    navigateTo("");
                                }}
                                className="rounded-tr-md rounded-tl-md"
                                style={styles.bottomSheetLinkTab}
                                underlayColor="#161B2180"
                            >
                                <View className="flex flex-row items-center px-4">
                                    <Entypo
                                        name="home"
                                        size={20}
                                        color={iconColor}
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        Home
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />
                            <TouchableHighlight
                                underlayColor="#161B2180"
                                onPress={() => navigateTo("user_manual")}
                                className="rounded-br-md rounded-bl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <View className="flex flex-row items-center px-4">
                                    <Foundation
                                        name="book"
                                        width={20}
                                        size={20}
                                        color={iconColor}
                                        className="text-center"
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        User Manual
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View>
                            <TouchableHighlight
                                underlayColor="#161B2180"
                                onPress={() => navigateTo("settings")}
                                style={styles.bottomSheetLinkTab}
                                className="rounded-tr-md rounded-tl-md"
                            >
                                <View className="flex flex-row items-center px-4">
                                    <MaterialIcons
                                        name="settings"
                                        width={20}
                                        size={20}
                                        color={iconColor}
                                        className="text-center"
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        Settings
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            {result && (
                                <View>
                                    <View
                                        style={{
                                            height: 0.5,
                                            backgroundColor: "#80808080",
                                        }}
                                    />
                                    <TouchableHighlight
                                        underlayColor="#161B2180"
                                        onPress={() => navigateTo("analysis")}
                                        style={styles.bottomSheetLinkTab}
                                    >
                                        <View className="flex flex-row items-center px-4">
                                            <Entypo
                                                name="back-in-time"
                                                width={20}
                                                size={20}
                                                color={iconColor}
                                                className="text-center"
                                            />
                                            <Text
                                                style={styles.bottomsheetText}
                                            >
                                                View Previous Test Results
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            )}

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableHighlight
                                underlayColor="#161B2180"
                                onPress={() =>
                                    navigateToSite(
                                        "https://sleepspec-landing.vercel.app",
                                    )
                                }
                                style={styles.bottomSheetLinkTab}
                            >
                                <View className="flex flex-row items-center px-4">
                                    <MaterialCommunityIcons
                                        name="web"
                                        width={20}
                                        size={20}
                                        color={iconColor}
                                        className="text-center"
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        Visit our Website
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableHighlight
                                underlayColor="#161B2180"
                                onPress={() => navigateTo("training_results")}
                                style={styles.bottomSheetLinkTab}
                            >
                                <View className="flex flex-row items-center px-4">
                                    <MaterialCommunityIcons
                                        name="chart-box"
                                        width={20}
                                        size={20}
                                        color={iconColor}
                                        className="text-center"
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        About the Model
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableHighlight
                                underlayColor="#161B2180"
                                onPress={() => navigateTo("AboutUs")}
                                className="rounded-br-md rounded-bl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <View className="flex flex-row items-center px-4">
                                    <FontAwesome6
                                        name="user-group"
                                        width={20}
                                        size={14}
                                        color={iconColor}
                                        className="text-center"
                                    />
                                    <Text style={styles.bottomsheetText}>
                                        About Us
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View className="mt-4 flex flex-col items-center">
                            <Text className="text-secondary text-center font-light font-publicsansLight opacity-80 text-sm">
                                Developed by
                            </Text>
                            <Image
                                source={require("../assets/images/16KHz Labs.png")}
                                contentFit="contain"
                                style={{ width: 68, height: 40 }}
                            ></Image>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bottomSheetWrapper: {
        backgroundColor: "#1F242A",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    bottomSheetHeader: { borderBottomColor: "#808080" },
    bottomsheetContent: {},
    bottomSheetLinkTab: {
        backgroundColor: "#161B21",
    },
    bottomsheetText: {
        color: "#DDDDDD",
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 16,
    },

    drawerHolder: {
        top: 10,
        left: "43%",
        borderRadius: 20,
        zIndex: 100,
        backgroundColor: "#808080",
        height: 5,
        width: 50,
    },
});
