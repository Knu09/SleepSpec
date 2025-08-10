import { StyleSheet, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
// Icon families
import {
    FontAwesome,
    FontAwesome6,
    FontAwesome5,
    Ionicons,
} from "@expo/vector-icons";

type GradientIconProps = {
    name: string;
    size: number;
    family?: "FontAwesome" | "FontAwesome5" | "FontAwesome6" | "Ionicons";
};

const iconFamilies = {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
};

const GradientIcon = ({
    name,
    size,
    family = "FontAwesome6",
}: GradientIconProps) => {
    const IconComponent = iconFamilies[family];
    return (
        <MaskedView
            maskElement={
                <View className="flex justify-center items-center">
                    <IconComponent
                        name={name as any}
                        size={size}
                        color="black"
                    />
                </View>
            }
        >
            <LinearGradient
                colors={["#006FFF", "#7800D3"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                    width: size,
                    height: size,
                }}
            />
        </MaskedView>
    );
};

export default GradientIcon;

const styles = StyleSheet.create({});
