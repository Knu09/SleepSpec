import { ThemeContext } from "@/context/ThemeContext";
import { getStyles } from "@/types/types";
import { Feather } from "@expo/vector-icons";
import {
    forwardRef,
    useCallback,
    useContext,
    useImperativeHandle,
    useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastMessageProps {
    type?: "success" | "warning" | "error" | "info";
    title: string;
    description: string;
    duration: number;
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

    const [state, setState] = useState({
        title: "",
        isShow: false,
        type: "",
        description: "",
    });

    const { toastIconColor, Color } = getStyles(state.type);

    const updateState = (newState: object) => {
        setState((prevState: any) => ({
            ...prevState,
            ...newState,
        }));
    };

    const show = useCallback(
        ({ title, description, type, duration = 5000 }: ToastMessageProps) => {
            updateState({
                isShow: true,
                title,
                description,
                type,
            });
            toastTopAnimation.value = withSequence(
                withTiming(40, { duration: 250 }),
                withDelay(
                    duration,
                    withTiming(-100, { duration: 250 }, (finished) => {
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
        [insets, toastTopAnimation],
    );

    useImperativeHandle(ref, () => ({
        show: (props: ToastMessageProps) => show(props),
    }));

    const animatedTopStyle = useAnimatedStyle(() => {
        return {
            top: toastTopAnimation.value,
        };
    });

    return (
        <>
            {state.isShow && (
                <Animated.View
                    className={`absolute left-10 right-10 rounded-md p-2 flex-row items-center gap-4 bg-white`}
                    style={[
                        {
                            zIndex: 1000,
                            elevation: 3,
                            borderLeftColor: toastIconColor,
                            borderLeftWidth: 2.5,
                        },
                        animatedTopStyle,
                    ]}
                >
                    <View>
                        <Feather name="info" size={20} color={toastIconColor} />
                    </View>
                    <View className="gap-1">
                        <Text className={`text-darkBg font-publicsansBold`}>
                            {state.title}
                        </Text>

                        {state.description && (
                            <Text
                                className={`text-darkBg text-sm font-publicsansLight opacity-80 leading-4`}
                            >
                                {state.description}
                            </Text>
                        )}
                    </View>
                </Animated.View>
            )}
        </>
    );
});

export default ToastMessage;

const styles = StyleSheet.create({});
