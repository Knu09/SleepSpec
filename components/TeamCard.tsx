import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome6, Feather } from "@expo/vector-icons";
import { ThemeContext } from "@/context/ThemeContext";

interface TeamCardProps {
    name: string;
    role: string;
    email: string;
    github?: string;
    portfolio?: string;
    textClass?: string;
    navigateToSite: (url: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
    name,
    role,
    email,
    github,
    portfolio,
    textClass = "",
    navigateToSite,
}) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    return (
        <View
            className={
                (isDark ? "bg-darkLayer" : "bg-white") +
                " gap-3 py-3 px-4 border-[0.5px] rounded-md w-full"
            }
        >
            {/* Name and Role */}
            <View>
                <Text
                    className={`${textClass} font-publicsansBold text-lg leading-5`}
                >
                    {name}
                </Text>
                <Text className={`${textClass} font-publicsans opacity-80`}>
                    {role}
                </Text>
            </View>

            {/* Contact Info */}
            <View className="pe-4 gap-2">
                {/* Email */}
                <View className="flex-row gap-2 items-center">
                    <MaterialIcons
                        name="email"
                        size={18}
                        color={isDark ? "#DDD" : "black"}
                    />
                    <Text className={`${textClass} font-publicsans opacity-80`}>
                        {email}
                    </Text>
                </View>

                {/* GitHub */}
                {github && (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigateToSite(github)}
                        className="flex-row gap-2 items-center"
                    >
                        <FontAwesome6
                            name="github"
                            size={18}
                            color={isDark ? "#DDD" : "black"}
                        />
                        <Text
                            className={`${textClass} font-publicsans opacity-80 underline`}
                        >
                            {github}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Portfolio */}
                {portfolio && (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigateToSite(portfolio)}
                        className="flex-row gap-2 items-center"
                    >
                        <Feather
                            name="link"
                            size={18}
                            color={isDark ? "#DDD" : "black"}
                        />
                        <Text
                            className={`${textClass} font-publicsans opacity-80 underline`}
                        >
                            {portfolio}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default TeamCard;
