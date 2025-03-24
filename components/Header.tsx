import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { FontAwesome, FontAwesome6, Feather } from "@expo/vector-icons";

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

    return (
        <View
            style={styles.header}
            className="flex flex-row px-6 w-full h-14 justify-between items-center bg-transparent"
        >
            <View className="">
                {back && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome
                            size={28}
                            width={28}
                            name={"angle-left"}
                            color="#006FFF"
                        />
                    </TouchableOpacity>
                )}
                {userMan && (
                    <View>
                        <FontAwesome6
                            name="circle-question"
                            size={22}
                            className="text-center"
                            width={28}
                            color="#006FFF"
                        />
                    </View>
                )}
            </View>

            <View className="flex-1 items-center">
                <Text
                    style={{ color: "#DDDDDD" }}
                    className="font-bold text-lg text-center"
                >
                    {title}
                </Text>
            </View>

            <View className="w-10 items-end">
                {menu && (
                    <TouchableOpacity className="">
                        <Feather
                            size={20}
                            className="text-center"
                            width={28}
                            name={"menu"}
                            color="#006FFF"
                        />
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
});
