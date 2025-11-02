import React, { useContext } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableHighlight,
    Linking,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemeContext } from "@/context/ThemeContext";
import { AntDesign, Entypo } from "@expo/vector-icons";

interface InfoModalProps {
    title: string;
    description: string;
    isModalVisible: boolean;
    onClose: () => void;
    references?: { title: string; url: string }[];
}

const InfoModal = ({
    title,
    description,
    isModalVisible = false,
    onClose,
    references,
}: InfoModalProps) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";

    const navigateToSite = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
            <BlurView intensity={100} tint="dark" className="flex-1">
                <View
                    className="flex-1 justify-center items-center"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View className={modalColor + " mx-3 p-4 rounded-lg gap-4"}>
                        <View className="flex flex-row justify-between items-center">
                            <Text
                                className={
                                    textClass +
                                    " font-bold font-publicsans text-lg"
                                }
                            >
                                {title}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <AntDesign
                                    name="close"
                                    size={18}
                                    color={isDark ? "white" : "black"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text
                                className={
                                    textClass +
                                    " text-sm font-normal font-publicsans"
                                }
                            >
                                {description}
                            </Text>
                            <Text
                                className={
                                    textClass +
                                    " font-bold font-publicsans mt-4"
                                }
                            >
                                References:
                            </Text>

                            {(references || []).map((ref, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => navigateToSite(ref.url)}
                                    className="flex-col gap-2"
                                >
                                    <Text
                                        className={`${textClass} mt-2 text-sm font-publicsans opacity-80 underline`}
                                    >
                                        ‣ {ref.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="mt-4">
                            <TouchableHighlight
                                className="flex w-full rounded-md py-3"
                                style={{
                                    backgroundColor: isDark
                                        ? "rgba(255,255,255,0.1)"
                                        : "rgba(0,0,0,0.1)",
                                }}
                                underlayColor={
                                    isDark
                                        ? "rgba(255,255,255,0.2)"
                                        : "rgba(0,0,0,0.2)"
                                }
                                onPress={onClose}
                            >
                                <Text
                                    className={
                                        textClass +
                                        " text-center font-publicsans font-bold"
                                    }
                                >
                                    Close
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

export default InfoModal;
