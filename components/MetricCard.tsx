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
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const borderColor = isDark ? "#006FFF" : "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const cardColor = isDark ? "#161B21" : "#FFF";

    return (
        <View
            className="gap-2"
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
                        className={
                            textClass + " font-publicsans font-bold text-xl"
                        }
                    >
                        {`${fill.toFixed(1)}%`}
                    </Text>
                )}
            </AnimatedCircularProgress>
            <Text
                className={textClass + " font-publicsans font-bold"}
                style={[styles.percentText]}
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
        fontWeight: "bold",
        fontSize: 16,
    },
    label: {
        color: "#E5E5E5",
        marginTop: 8,
        fontWeight: "600",
    },
});

export default MetricCard;
