import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { SettingButtonProps } from "@/types/types";

const SettingButton = ({
    title,
    icon,
    onPress,
    isActive,
    theme,
}: SettingButtonProps) => {
    const isDark = theme === "dark";

    const currentTheme = isDark ? "bg-darkLayer" : "bg-white";
    const currentText = isDark ? "text-secondary" : "text-darkBg";
    const iconColor = isDark ? "#DDD" : "#808080";

    return (
        <TouchableOpacity
            className={
                currentTheme +
                " flex flex-row justify-between items-center p-4 rounded-lg shadow-md"
            }
            onPress={onPress}
        >
            <View className="flex flex-row items-center gap-4">
                <Entypo name={icon} size={16} color={iconColor} />
                <Text className={currentText + " font-publicsans"}>
                    {title}
                </Text>
            </View>
            <FontAwesome6
                name={isActive ? "circle-dot" : "circle"}
                size={16}
                color={iconColor}
            />
        </TouchableOpacity>
    );
};

export default SettingButton;

const styles = StyleSheet.create({});
