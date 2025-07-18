import { ThemeContext } from "@/context/ThemeContext";
import { getStyles } from "@/types/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
    forwardRef,
    useCallback,
    useContext,
    useImperativeHandle,
    useState,
} from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ToastMessageProps {
    type?: "success" | "warning" | "error" | "info";
    title: string;
    description: string;
    duration: number;
    iconName?: string;
    iconFamily?: string;
    delay?: number;
}

const ToastMessage = forwardRef(({}, ref) => {
    const { currentTheme } = useContext(ThemeContext);
    const isDark = currentTheme === "dark";
    const textClass = isDark ? "text-secondary" : "text-darkBg";
    const bgClass = isDark ? "bg-darkBg" : "bg-lightBg";
    const micColor = "#006FFF";
    const bottomGradient = isDark ? "#01000F" : "#FFF";
    const topStopColor = isDark ? "#006FFF" : "#595959";
    const bottomStopColor = isDark ? "#7800D3" : "#585858";
    const borderColorClass = isDark
        ? "border-primary border-t-[1px]"
        : "border-divider border-t-[1px]";
    const modalColor = isDark ? "bg-darkLayer" : "bg-white";
    const iconColor = isDark ? "#FFF" : "#01000F";

    const toastTopAnimation = useSharedValue(-100);
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = Dimensions.get("window");
    const toastSlideX = useSharedValue(-screenWidth);

    const [state, setState] = useState({
        title: "",
        isShow: false,
        type: "",
        description: "",
        iconName: "",
        iconFamily: "",
    });

    const { toastIconColor, Color } = getStyles(state.type);

    let IconComponent;

    switch (state.iconFamily) {
        case "Ionicons":
            IconComponent = Ionicons;
            break;
        case "Feather":
            IconComponent = Feather;
            break;
        default:
            IconComponent = Feather;
    }

    const updateState = (newState: object) => {
        setState((prevState: any) => ({
            ...prevState,
            ...newState,
        }));
    };

    const show = useCallback(
        ({
            title,
            description,
            type,
            duration = 5000,
            iconName,
            iconFamily,
        }: ToastMessageProps) => {
            updateState({
                isShow: true,
                title,
                description,
                type,
                iconName: iconName ?? "info",
                iconFamily: iconFamily ?? "Feather",
            });

            console.log("Toast icon: ", iconName, iconFamily);

            //NOTE: Preserve this code for optionalility
            // toastTopAnimation.value = withTiming(90, { duration: 250 });

            toastSlideX.value = withTiming(0, { duration: 250 });

            toastSlideX.value = withSequence(
                withTiming(0, { duration: 250 }),
                withDelay(
                    duration,
                    withTiming(-screenWidth, { duration: 250 }, (finished) => {
                        if (finished) {
                            runOnJS(() =>
                                updateState({
                                    isShow: false,
                                }),
                            );
                        }
                    }),
                ),
            );
        },
        [insets, toastTopAnimation, toastSlideX],
    );

    useImperativeHandle(ref, () => ({
        show: (props: ToastMessageProps) => show(props),
        hide: () => {
            toastSlideX.value = withTiming(
                -screenWidth,
                { duration: 250 },
                (finished) => {
                    if (finished) {
                        runOnJS(() =>
                            updateState({
                                isShow: false,
                                title: "",
                                description: "",
                                type: "",
                            }),
                        );
                    }
                },
            );
        },
    }));

    const animatedTopStyle = useAnimatedStyle(() => {
        return {
            top: 90,
            transform: [{ translateX: toastSlideX.value }],
        };
    });

    return (
        <>
            {state.isShow && (
                <Animated.View
                    className="absolute left-10 right-10 rounded-md bg-white"
                    style={[
                        {
                            zIndex: 1000,
                            elevation: 4,
                            borderLeftColor: toastIconColor,
                            borderLeftWidth: 2.5,
                        },
                        animatedTopStyle,
                    ]}
                >
                    <View
                        className="p-2 flex-row items-center justify-center gap-2"
                        style={{ flexWrap: "nowrap" }}
                    >
                        <View className="px-1">
                            <IconComponent
                                name={state.iconName}
                                size={20}
                                color={toastIconColor}
                            />
                        </View>
                        <View
                            className="gap-1"
                            style={{ flexShrink: 1, flexGrow: 1 }}
                        >
                            <Text
                                className="text-darkBg font-publicsansBold"
                                numberOfLines={0}
                                style={{ flexWrap: "wrap" }}
                            >
                                {state.title}
                            </Text>
                            {state.description && (
                                <Text
                                    className="text-darkBg text-sm font-publicsansLight opacity-80 leading-4"
                                    numberOfLines={0}
                                    style={{ flexWrap: "wrap" }}
                                >
                                    {state.description}
                                </Text>
                            )}
                        </View>
                    </View>
                </Animated.View>
            )}
        </>
    );
});

export default ToastMessage;

const styles = StyleSheet.create({});
