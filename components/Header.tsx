import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const menuBar = require("@/assets/images/menu-bar.svg");
const userManIcon = require("@/assets/images/user-manual-icon.svg");
const backIcon = require("@/assets/images/back.svg");

const Header = ({
    menu = false,
    back = false,
    title = "",
    userMan = false,
}) => {
    const navigation = useNavigation();

    return (
        <View
            style={styles.header}
            className="flex flex-row w-full px-6 h-14 justify-between items-center bg-transparent"
        >
            <View style={styles.view} className="w-10">
                {back && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={backIcon}></Image>
                    </TouchableOpacity>
                )}
                {userMan && (
                    <View>
                        <Image source={userManIcon}></Image>
                    </View>
                )}
            </View>

            <View style={styles.view} className="flex-1 items-center">
                <Text
                    style={{ color: "#DDDDDD" }}
                    className="font-bold text-lg text-center"
                >
                    {title}
                </Text>
            </View>

            <View style={styles.view} className="w-10 items-end">
                {menu && (
                    <TouchableOpacity>
                        <Image source={menuBar}></Image>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
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
    view: {
        margin: 10,
    },
});
