import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

type RecordStatusProps = {
    color: string;
    status: string;
};

const RecordingStatus = ({ color, status }: RecordStatusProps) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme;
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    return (
        <View
            className="px-2 py-1 rounded-2xl gap-2 flex-row items-center"
            style={{ borderColor: color, borderWidth: 1 }}
        >
            <Text className={textClass + ` font-publicsans text-sm font-bold`}>
                {status}
            </Text>
            <View
                className="w-3 h-3"
                style={{ backgroundColor: color, borderRadius: 200 }}
            />
        </View>
    );
};

export default RecordingStatus;
