import { StyleSheet, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";

const GradientIcon = ({ name, size }: { name: string; size: number }) => {
    return (
        <MaskedView
            maskElement={
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Icon name={name} size={size} color="black" />
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
