import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";

export default function Accordion({
    title,
    description,
    isOpened = false,
    image,
}: {
    title: string;
    description: string;
    isOpened: boolean;
    image: string;
}) {
    const [opened, setOpened] = useState(isOpened);
    const [imageKey, setImageKey] = useState(Date.now());

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
            <View className="bg-darkBg" style={styles.borderRadius}>
                <TouchableWithoutFeedback onPress={toggleAccordion}>
                    <View
                        className="flex flex-row w-full items-center justify-between px-4 py-3"
                        style={styles.headerAccordion}
                    >
                        <Text className="text-secondary font-publicsans font-bold">
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
                            <Text className="text-white font-normal">
                                {description}
                            </Text>
                        </View>

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
                                source={{
                                    uri: `http://192.168.134.107:5000/plots/${image}?t=${Date.now()}`,
                                }}
                                style={{
                                    flex: 1,
                                    width: "100%",
                                }}
                                resizeMode="cover"
                            />
                        </View>
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
