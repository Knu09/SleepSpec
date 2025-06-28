import { ThemeContext } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Image, ImageSource } from "expo-image";
import { Href, SplashScreen, useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useContext, useEffect } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from "react-native";

type TabProps = {
    icon: ImageSource;
    name: string;
    link: Href;
};

export default function TabNavigation() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require("@/assets/fonts/Public_Sans/static/PublicSans-Regular.ttf"),
        "PublicSans-Bold": require("@/assets/fonts/Public_Sans/static/PublicSans-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <View
            style={{
                justifyContent: "center",
                borderTopWidth: 0.5,
                borderTopColor: "#808080",
            }}
        >
            <View className="flex-row" style={styles.nav}>
                <Tab
                    icon={require("@/assets/images/tab-analysis.svg")}
                    name="Analysis"
                    link="/analysis"
                />
                <Tab
                    icon={require("@/assets/images/tab-classification.svg")}
                    name="Classification"
                    link="/classification"
                />
                <Tab
                    icon={require("@/assets/svg/")}
                    name={"Feature"}
                    link="/feature-analysis"
                />
            </View>
        </View>
    );
}

function Tab({ icon, name, link }: TabProps) {
    const PATH = useRouteInfo().pathname;
    const router = useRouter();
    const ICON_SIZE = 25;

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-white" : "text-darkBg";

    const is_selected = PATH == link;

    return (
        <TouchableOpacity onPress={() => is_selected || router.replace(link)}>
            <View
                className="flex items-center gap-0.5"
                style={{ opacity: is_selected ? 1 : 0.5 }}
            >
                <Image
                    source={icon}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
                <Text
                    className={
                        (is_selected ? "text-primaryBlue" : textClass) +
                        " font-publicsans font-bold text-[10px] text-center"
                    }
                    style={{
                        opacity: is_selected ? 1 : 0.5,
                    }}
                >
                    {name}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    nav: {
        marginTop: "auto",
        paddingVertical: 14,
        justifyContent: "space-evenly",
    },
});
