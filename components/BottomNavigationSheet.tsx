import { useEffect, useRef, useCallback } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "./BottomSheetContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useClassStore } from "@/store/store";
// import { BlurView } from "expo-blur";

// function RootStack() {
//   return (
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen name="Home" component={Index} />
//     </Stack.Navigator>
//   );
// }

export default function BottomNavigationSheet() {
    const { isVisible, hideBottomSheet } = useBottomSheet();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const router = useRouter();

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
                snapPoints={["50%"]}
                handleComponent={() => null}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: "transparent" }}
                style={styles.bottomSheetWrapper}
            >
                {/* TODO: change the navigation links */}
                {/* FIXME: blue view not working */}
                {/* <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /> */}

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
                                <Text className="text-secondary font-publicsans opacity-80 text-sm">
                                    Sleep deprivation detection
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="p-5 bg-arsenic gap-4">
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    // hideBottomSheet();
                                    // router.push("/");
                                    navigateTo("");
                                }}
                                className="rounded-tr-md rounded-tl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>Home</Text>
                            </TouchableOpacity>
                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => navigateTo("user_manual")}
                                className="rounded-br-md rounded-bl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>
                                    User Manual
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={() => navigateTo("")}
                                className="rounded-tr-md rounded-tl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>
                                    Trained Model Source
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => navigateTo("training_results")}
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>
                                    Training Results
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => navigateTo("settings")}
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>
                                    Settings
                                </Text>
                            </TouchableOpacity>
                            {result && (
                                <TouchableOpacity
                                    onPress={() => navigateTo("analysis")}
                                    style={styles.bottomSheetLinkTab}
                                >
                                    <Text style={styles.bottomsheetText}>
                                        View Recent Test Results
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Divider */}
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "#80808080",
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => navigateTo("about_us")}
                                className="rounded-br-md rounded-bl-md"
                                style={styles.bottomSheetLinkTab}
                            >
                                <Text style={styles.bottomsheetText}>
                                    About Us
                                </Text>
                            </TouchableOpacity>
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
        paddingHorizontal: 15,
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
