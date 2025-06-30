import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
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
import { useContext } from "react";
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
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";

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

    // const isRemote = image.startsWith("http");
    // const isPlotFilename = !image.includes("/");
    // const isRemote = typeof image === "string" && image.startsWith("http");
    // const isPlotFilename = typeof image === "string" && !image.includes("/");

    // const imageUri = isRemote
    //   ? image
    //   : isPlotFilename
    //     ? `${process.env.EXPO_PUBLIC_API_URL}/plots/${image}?t=${Date.now()}`
    // : null;

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
        <LinearGradient
            colors={["#006EFF", "#7800D3"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="justify-center items-center"
            style={styles.linearGradientContainer}
        >
            <View
                style={[
                    styles.borderRadius,
                    {
                        backgroundColor: isDark ? "#1E1E2E" : "#FFFFFF",
                    },
                ]}
            >
                <TouchableWithoutFeedback onPress={toggleAccordion}>
                    <View
                        className="flex flex-row w-full items-center justify-between px-4 py-3"
                        style={[
                            styles.headerAccordion,
                            {
                                backgroundColor: isDark
                                    ? "rgba(217, 217, 217, 0.1)"
                                    : "#F0F0F0",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: isDark ? "#E5E5E5" : "#1E1E2E",
                                fontWeight: "bold",
                            }}
                        >
                            {title}
                        </Text>
                        <Icon
                            name={opened ? "chevron-up" : "chevron-down"}
                            size={15}
                            color={"rgba(128, 128, 128, 0.5)"}
                        />
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
                                    style={{
                                        color: isDark ? "#E5E5E5" : "#1E1E2E",
                                        fontWeight: "400",
                                    }}
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
                                            <Text className="text-secondary leading-6">
                                                {list.type === "number"
                                                    ? `${idx + 1}.`
                                                    : "•"}
                                            </Text>
                                            <View className="flex-1">
                                                <Text
                                                    style={{
                                                        color: isDark
                                                            ? "#E5E5E5"
                                                            : "#1E1E2E",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {item.title &&
                                                        item.title + ": "}
                                                    <Text className="font-normal text-secondary">
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
                                    borderRadius: 10,
                                }}
                                className="p-4 bg-white"
                            >
                                <Image
                                    key={imageKey}
                                    source={imageSource}
                                    style={{ flex: 1, width: "100%" }}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradientContainer: {
        borderRadius: 8,
        padding: 1,
    },
    borderRadius: {
        borderRadius: 8,
    },
    headerAccordion: {
        backgroundColor: "rgba(217, 217, 217, 0.1)",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    contentAccordion: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
