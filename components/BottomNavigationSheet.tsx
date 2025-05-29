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
    <>
      <TouchableWithoutFeedback onPress={hideBottomSheet}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={["30%"]}
        handleComponent={() => null}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "transparent" }}
        style={styles.bottomSheetWrapper}
      >
        {/* TODO: change the navigation links */}
        {/* FIXME: blue view not working */}
        {/* <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /> */}
        <View className="w-6 h-1 bg-white" style={styles.drawerHolder}></View>
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
          <TouchableOpacity onPress={() => navigateTo("user_manual")}>
            <Text style={styles.bottomsheetText}>User Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("")}>
            <Text style={styles.bottomsheetText}>Trained Model Source</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("training_results")}>
            <Text style={styles.bottomsheetText}>Training Results</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("about_us")}>
            <Text style={styles.bottomsheetText}>About Us</Text>
          </TouchableOpacity>
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
    backgroundColor: "#23242A",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomsheetContent: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  bottomsheetText: {
    color: "#DDDDDD",
    marginVertical: 12,
    fontSize: 16,
  },

  drawerHolder: {
    top: 15,
    left: "47%",
    borderRadius: 20,
    zIndex: 100,
  },
});
