import { Image } from "expo-image"
import { RelativePathString, Link, useRouter, Href } from "expo-router"
import { useRouteInfo } from "expo-router/build/hooks"
import { View, Text } from "react-native"

type TabProps = {
    icon: NodeJS.Require
    name: string
    link: Href
}

export default function TabNavigation() {
    return (
        <View className="mt-28 py-4 flex flex-row justify-around items-center border border-t-gray-300">
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
                link="/"
            />
        </View>
    )
}

function Tab({icon, name, link}: TabProps) {
    const PATH = useRouteInfo().pathname
    const ICON_SIZE = 36; 
    let opacity = "opacity-100"

    // Dim all non-selected tabs
    if (PATH != link) opacity = "opacity-30";

    return <Link href={link}>
        <View className={`flex items-center gap-2 ${opacity}`}>
            <Image source={icon} style={{width: ICON_SIZE, height: ICON_SIZE}} />
            <Text className="text-white font-semibold">{name}</Text>
        </View>
    </Link>
}
