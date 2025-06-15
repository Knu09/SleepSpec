import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";

const SettingButton = () => {
    return (
        <TouchableOpacity
            className="flex flex-row justify-between items-center bg-darkGray p-4 rounded-lg"
            onPress={() => {}}
        >
            <View className="flex flex-row items-center gap-4">
                <Entypo name="light-up" size={16} color="#DDD" />
                <Text className="text-secondary">Dark Mode</Text>
            </View>
            <FontAwesome6 name="circle" size={16} color="#DDD" />
        </TouchableOpacity>
    );
};

export default SettingButton;

const styles = StyleSheet.create({});
