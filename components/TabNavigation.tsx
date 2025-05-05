import { Image } from "expo-image";
import { Href, Link, RelativePathString, useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { StyleSheet, Text, View } from "react-native";

type TabProps = {
    icon: NodeJS.Require;
    name: string;
    link: Href;
};

export default function TabNavigation() {
    return (
        <View className="flex flex-row" style={styles.nav}>
            <Tab
                icon={require("@/assets/images/tab-analysis.svg")}
                name="Analysis"
                link="/analysis"
            />
            <Tab
                icon={require("@/assets/images/tab-classification.svg")}
                name="Classification"
                link="/"
            />
            <Tab
                icon={require("@/assets/images/tab-feature-analysis.svg")}
                name="F - Analysis"
                link="/feature-analysis"
            />
        </View>
    );
}

function Tab({ icon, name, link }: TabProps) {
    const PATH = useRouteInfo().pathname;
    const ICON_SIZE = 36;

    const is_selected = PATH == link;

    return (
        <Link href={link}>
            <View
                className="flex items-center gap-2"
                style={{ opacity: is_selected ? 1 : 0.4 }}
            >
                <Image
                    source={icon}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
                <Text
                    className="font-semibold"
                    style={{ color: is_selected ? "#ddd" : "gray" }}
                >
                    {name}
                </Text>
            </View>
        </Link>
    );
}

const styles = StyleSheet.create({
    nav: {
        marginTop: "auto",
        paddingVertical: 14,
        paddingHorizontal: 12,
        justifyContent: "space-between",
    },
});
