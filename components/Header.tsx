import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import BottomNavigationSheet from "./BottomNavigationSheet";

interface HeaderProps {
  menu?: boolean;
  back?: boolean;
  title?: string;
  userMan?: boolean;
}

const Header = ({
  menu = false,
  back = false,
  title = "",
  userMan = false,
}: HeaderProps) => {
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
