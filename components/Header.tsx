import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface HeaderProps {
  menu?: boolean;
  back?: boolean;
  title?: string;
  userMan?: boolean;
}

function BottomNavigationSheet() {
  console.log("IM RUNING");
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["30%"]}
        handleComponent={() => null}
      >
        <BottomSheetView style={styles.bottomsheetContent}>
          <TouchableOpacity>
            <Text style={styles.bottomsheetText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.bottomsheetText}>User Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.bottomsheetText}>Trained Model Source</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.bottomsheetText}>Training Results</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.bottomsheetText}>About Us</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const Header = ({
  menu = false,
  back = false,
  title = "",
  userMan = false,
}: HeaderProps) => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        FontAwesome: FontAwesome.font,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return <BottomNavigationSheet />;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  bottomsheetContent: {
    // flex: 1,
    // padding: 36,
    backgroundColor: "#000000",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  bottomsheetText: {
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
  },
});
