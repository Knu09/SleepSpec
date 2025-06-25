import { ThemeContext } from "@/context/ThemeContext";
import { Image, ImageSource } from "expo-image";
import { Href, useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabProps = {
    icon: ImageSource;
    name: string;
    link: Href;
};

export default function TabNavigation() {
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
                    icon={require("@/assets/images/tab-feature-analysis.svg")}
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
    const ICON_SIZE = 30;

    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-white" : "text-darkBg";

    const is_selected = PATH == link;

    return (
        <Pressable onPress={() => is_selected || router.replace(link)}>
            <View
                className="flex items-center gap-1"
                style={{ opacity: is_selected ? 1 : 0.5 }}
            >
                <Image
                    source={icon}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
                <Text
                    className={
                        textClass +
                        " font-publicsans font-bold text-sm text-center"
                    }
                    style={{ opacity: is_selected ? 1 : 0.5 }}
                >
                    {name}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    nav: {
        marginTop: "auto",
        paddingVertical: 14,
        justifyContent: "space-evenly",
    },
});
