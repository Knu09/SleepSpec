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
    icons: {
        light: { active: any; inactive: any };
        dark: { active: any; inactive: any };
    };
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
                    icons={{
                        light: {
                            active: require("@/assets/svg/analysis.svg"),
                            inactive: require("@/assets/svg/analysis_light_inactive.svg"),
                        },
                        dark: {
                            active: require("@/assets/svg/analysis.svg"),
                            inactive: require("@/assets/svg/analysis_dark_inactive.svg"),
                        },
                    }}
                    name="Analysis"
                    link="/analysis"
                />
                <Tab
                    icons={{
                        light: {
                            active: require("@/assets/svg/classification.svg"),
                            inactive: require("@/assets/svg/classification_light_inactive.svg"),
                        },
                        dark: {
                            active: require("@/assets/svg/classification.svg"),
                            inactive: require("@/assets/svg/classification_dark_inactive.svg"),
                        },
                    }}
                    name="Classification"
                    link="/classification"
                />
                <Tab
                    icons={{
                        light: {
                            active: require("@/assets/svg/feature_analysis_icon.svg"),
                            inactive: require("@/assets/svg/feature_analysis_dark_inactive.svg"),
                        },
                        dark: {
                            active: require("@/assets/svg/feature_analysis_icon.svg"),
                            inactive: require("@/assets/svg/feature_analysis_light_inactive.svg"),
                        },
                    }}
                    name={"Feature"}
                    link="/feature-analysis"
                />
            </View>
        </View>
    );
}

function Tab({ icons, name, link }: TabProps) {
    const PATH = useRouteInfo().pathname;
    const router = useRouter();
    const ICON_SIZE = 25;

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-white" : "text-darkBg";

    const is_selected = PATH == link;

    const icon = isDark
        ? is_selected
            ? icons.dark.active
            : icons.dark.inactive
        : is_selected
          ? icons.light.active
          : icons.light.inactive;

    return (
        <TouchableOpacity onPress={() => is_selected || router.replace(link)}>
            <View
                className="flex items-center gap-0.5"
                style={{ opacity: is_selected ? 1 : 0.8 }}
            >
                <View className="flex justify-center items-center">
                    <Image
                        source={icon}
                        style={{ width: ICON_SIZE, height: ICON_SIZE }}
                    />
                </View>
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
