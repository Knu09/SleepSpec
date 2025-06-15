import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { SettingButtonProps } from "@/types/types";

const SettingButton = ({
    title,
    icon,
    onPress,
    isActive,
}: SettingButtonProps) => {
    return (
        <TouchableOpacity
            className="flex flex-row justify-between items-center bg-darkGray p-4 rounded-lg"
            onPress={onPress}
        >
            <View className="flex flex-row items-center gap-4">
                <Entypo name={icon} size={16} color="#DDD" />
                <Text className="text-secondary">{title}</Text>
            </View>
            <FontAwesome6
                name={isActive ? "circle-check" : "circle"}
                size={16}
                color="#DDD"
            />
        </TouchableOpacity>
    );
};

export default SettingButton;

const styles = StyleSheet.create({});
