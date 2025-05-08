import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

interface ButtomNavigationSheetProps {
  onClose: () => void;
}

const BottomNavigationSheet = ({ onClose }: ButtomNavigationSheetProps) => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        FontAwesome: FontAwesome.font,
      });
      setFontsLoaded(true);
    }
    loadFonts();
    // bottomSheetRef.current?.expand();
  }, []);

  useEffect(() => {
    if (fontsLoaded && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  }, [fontsLoaded]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      if (index === -1) onClose();
    },
    [onClose],
  );
  if (!fontsLoaded) return null;

  // callbacks
  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={["25%", "50%"]}
        onChange={(index) => {
          handleSheetChanges(index);
          if (index === -1) onClose(); // Dismiss callback
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default BottomNavigationSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
