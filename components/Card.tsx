import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from "react-native";

const Card = ({ title, desc, url }) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "#01000F" : "#FFFFFF";
    const underlayBgClass = isDark ? "#01000F80" : "#FFFFFF80";
    const borderColor = isDark ? "#006FFF" : "#585858";
    const topStopColor = isDark ? "#006FFF" : "#01000F";
    const bottomStopColor = isDark ? "#7800D3" : "#01000F";
    const TabBackgroundColor = isDark ? "#01000F" : "#FFF";
    const headerColor = isDark ? "bg-arsenic" : "bg-grayLayer";
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";

    const navigateToSite = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity
            style={{ elevation: 3, backgroundColor: bgClass }}
            className=" px-4 py-3 rounded-md"
            activeOpacity={0.8}
        >
            <View className="gap-2">
                <View className="gap-1">
                    <Text
                        className={
                            textClass +
                            " text-lg leading-5 font-bold font-publicsans"
                        }
                    >
                        {title}
                    </Text>
                    <Text
                        className={
                            textClass + " text-sm font-publicsans opacity-80"
                        }
                    >
                        {desc}
                    </Text>
                </View>
                <TouchableOpacity
                    className=""
                    onPress={() => {
                        navigateToSite(url);
                    }}
                >
                    <Text className="text-primaryBlue text-sm font-publicsansLight font-medium">
                        LEARN MORE
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default Card;

const styles = StyleSheet.create({});
