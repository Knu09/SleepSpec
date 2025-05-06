import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouteInfo } from "expo-router/build/hooks";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabProps = {
    icon: NodeJS.Require;
    name: string;
    link: Href;
};

export default function TabNavigation() {
    return (
        <View
            className="flex-row justify-center border border-t-lightWhite/50"
            style={styles.nav}
        >
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
                name={"Feature\nAnalysis"}
                link="/feature-analysis"
            />
        </View>
    );
}

function Tab({ icon, name, link }: TabProps) {
    const PATH = useRouteInfo().pathname;
    const router = useRouter();
    const ICON_SIZE = 30;

    const is_selected = PATH == link;

    return (
        <Pressable onPress={() => is_selected || router.replace(link)}>
            <View
                className="flex items-center gap-1"
                style={{ opacity: is_selected ? 1 : 0.4 }}
            >
                <Image
                    source={icon}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
                <Text
                    className="font-semibold text-xs text-center"
                    style={{ color: is_selected ? "#ddd" : "gray" }}
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
        paddingHorizontal: 25,
        justifyContent: "space-between",
    },
});
