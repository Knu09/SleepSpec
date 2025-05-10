import { useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "./BottomSheetContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
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

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={["30%"]}
        handleComponent={() => null}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#000000" }}
      >
        {/* TODO: change the navigation links */}
        {/* FIXME: blue view not working */}
        {/* <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /> */}
        <BottomSheetView style={styles.bottomsheetContent}>
          <TouchableOpacity
            onPress={() => {
              // hideBottomSheet();
              // router.push("/");
              navigateTo("");
            }}
          >
            <Text style={styles.bottomsheetText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("feature-analysis")}>
            <Text style={styles.bottomsheetText}>User Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("feature-analysis")}>
            <Text style={styles.bottomsheetText}>Trained Model Source</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("feature-analysis")}>
            <Text style={styles.bottomsheetText}>Training Results</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("feature-analysis")}>
            <Text style={styles.bottomsheetText}>About Us</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bottomsheetContent: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 20,
  },
  bottomsheetText: {
    color: "#ffffff",
    marginVertical: 12,
    fontSize: 16,
  },
});
