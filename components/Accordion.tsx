import React, { useState } from "react";
import {
    Animated,
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";

export default function Accordion({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    const [opened, setOpened] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const numberOfWords = description.split(" ").length;

    function toggleAccordion() {
        if (!opened) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
        setOpened(!opened);
    }

    const heightAnimationInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (numberOfWords / 2.6) * 10], // Animation from first value to second value
    });
    const paddingAnimationInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 12], // Animation from first value to second value
    });
    return (
        <LinearGradient
            colors={["#006EFF", "#7800D3"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="justify-center items-center"
            style={styles.linearGradientContainer}
        >
            <View className=" bg-darkBg" style={styles.borderRadius}>
                <TouchableWithoutFeedback onPress={toggleAccordion}>
                    <View
                        className="flex flex-row w-full items-center justify-between px-4 py-3"
                        style={styles.headerAccordion}
                    >
                        <Text className="text-secondary font-publicsans font-bold">
                            {title}
                        </Text>
                        <Icon
                            className="me-2 opacity-50"
                            name={opened ? "chevron-up" : "chevron-down"}
                            size={15}
                            color={"rgba(128, 128, 128, 0.5)"}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.contentAccordion,
                        {
                            height: heightAnimationInterpolation,
                            paddingVertical: paddingAnimationInterpolation,
                        },
                    ]}
                >
                    <Text className="text-white font-normal">
                        {description}
                    </Text>
                </Animated.View>
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
