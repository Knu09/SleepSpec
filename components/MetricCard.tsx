import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

interface MetricProps {
    value: number;
    label: string;
    color?: string;
}

const MetricCard: React.FC<MetricProps> = ({ value, label, color }) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";

    return (
        <View
            style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
            <AnimatedCircularProgress
                size={100}
                width={10}
                fill={value}
                tintColor={color || "#4ADE80"}
                backgroundColor={isDark ? "#2E2E3E" : "#E5E5E5"}
                backgroundWidth={10}
                lineCap="round"
            >
                {(fill: Double) => (
                    <Text
                        style={[
                            styles.percentText,
                            { color: isDark ? "#E5E5E5" : "#1E1E2E" },
                        ]}
                    >
                        {`${fill.toFixed(1)}%`}
                    </Text>
                )}
            </AnimatedCircularProgress>
            <Text
                style={[
                    styles.percentText,
                    { color: isDark ? "#E5E5E5" : "#1E1E2E" },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        minWidth: 200,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    lightCard: {
        backgroundColor: "#FFFFFF",
        elevation: 3,
    },

    darkCard: {
        backgroundColor: "#1E1E2E",
    },
    percentText: {
        color: "#E5E5E5",
        fontWeight: "bold",
        fontSize: 18,
    },
    label: {
        color: "#E5E5E5",
        marginTop: 8,
        fontWeight: "600",
    },
});

export default MetricCard;
