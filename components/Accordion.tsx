import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import {
    Image,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    UIManager,
    View,
    ImageSourcePropType,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import localImages from "../store/imageMap";
import { ThemeContext } from "@/context/ThemeContext";

export default function Accordion({
    title,
    description,
    list,
    isOpened = false,
    image,
}: {
    title: string;
    description?: string;
    isOpened: boolean;
    image?: ImageSourcePropType | string;
    list?: {
        type: "bullet" | "number";
        items: {
            title?: string;
            description: string;
        }[];
    };
}) {
    const [opened, setOpened] = useState(isOpened);
    const [imageKey, setImageKey] = useState(Date.now());
    // const imageSource = image && localImages[image];
    const isRemote = typeof image === "string" && image.startsWith("http");
    const isPlotFilename = typeof image === "string" && !image.includes("/");

    const imageUri = isRemote
        ? image
        : isPlotFilename
          ? `${process.env.EXPO_PUBLIC_API_URL}/plots/${image}?t=${Date.now()}`
          : null;

    const imageSource =
        imageUri !== null
            ? { uri: imageUri }
            : typeof image !== "string"
              ? image
              : undefined;

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const borderColor = "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const bottomStopColor = isDark ? "#7800D3" : "#01000F";
    const TabBackgroundColor = isDark ? "#01000F" : "#FFF";
    const headerColor = isDark ? "#161B21" : "#EEF0F1";

    console.log(`${process.env.EXPO_PUBLIC_API_URL}/plots/${image}`);

    useEffect(() => {
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental?.(true);
        }
    }, []);

    useEffect(() => {
        setImageKey(Date.now());
    }, [isOpened]);

    const customAnimation = {
        duration: 300,
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
        },
        create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        delete: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
    };

    function toggleAccordion() {
        LayoutAnimation.configureNext(customAnimation);
        setOpened(!opened);
    }

    return (
        // <LinearGradient
        //     colors={["#006EFF", "#7800D3"]}
        //     start={{ x: 0.5, y: 0 }}
        //     end={{ x: 0.5, y: 1 }}
        //     className="justify-center items-center"
        //     style={styles.linearGradientContainer}
        // >
        <View
            className={isDark ? "bg-darkBg" : "bg-white"}
            style={[
                styles.borderRadius,
                { elevation: 0, borderWidth: 0.75, borderColor: "#585858" },
            ]}
        >
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View
                    className={
                        " flex flex-row w-full items-center justify-between px-4 py-3"
                    }
                    style={[
                        styles.headerAccordion,
                        {
                            backgroundColor: headerColor,
                            borderBottomColor: borderColor,
                            ...(opened
                                ? {
                                      borderBottomWidth: 0.75,
                                  } // When open, borderBottom
                                : {
                                      borderBottomLeftRadius: 10,
                                      borderBottomRightRadius: 10,
                                  }),
                        },
                    ]}
                >
                    <View>
                        <Text
                            className={textClass + " font-publicsans font-bold"}
                        >
                            {title}
                        </Text>
                    </View>
                    <View>
                        <Icon
                            name={opened ? "chevron-up" : "chevron-down"}
                            size={14}
                            color={"#585858"}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {opened && (
                <View
                    style={styles.contentAccordion}
                    className="flex flex-col gap-3"
                >
                    <View>
                        {description != undefined && (
                            <Text
                                className={
                                    textClass +
                                    " text-sm font-light font-pulicsansLight"
                                }
                            >
                                {description}
                            </Text>
                        )}
                        {list && (
                            <View className="mt-2">
                                {list.items.map((item, idx) => (
                                    <View
                                        key={idx}
                                        className="flex flex-row gap-4 mb-2"
                                    >
                                        <Text
                                            className={textClass + " leading-6"}
                                        >
                                            {list.type === "number"
                                                ? `${idx + 1}.`
                                                : "•"}
                                        </Text>
                                        <View className="flex-1">
                                            <Text
                                                className={
                                                    textClass +
                                                    " font-bold font-publicsans"
                                                }
                                            >
                                                {item.title &&
                                                    item.title + ": "}
                                                <Text
                                                    className={
                                                        textClass +
                                                        " font-normal font-publicsansLight text-sm"
                                                    }
                                                >
                                                    {item.description}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                    {image !== "" && (
                        <View
                            style={{
                                height: 215,
                                width: "100%",
                                borderRadius: 6,
                            }}
                            className="p-4 bg-white"
                        >
                            <Image
                                key={imageKey}
                                source={imageSource}
                                style={{ flex: 1, width: "100%" }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
        // </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradientContainer: {
        borderRadius: 10,
        padding: 1,
    },
    borderRadius: {
        borderRadius: 10,
    },
    headerAccordion: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    contentAccordion: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
