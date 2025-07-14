import { ThemeContext } from "@/context/ThemeContext";
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
                    className="absolute top-15 right-20 rounded-md left-20 p-2 bg-white"
                    style={[{ zIndex: 1000, elevation: 3 }, animatedTopStyle]}
                >
                    <Text className="text-darkBg font-publicsansBold">
                        {state.title}
                    </Text>
                    {state.description && (
                        <Text className="text-darkBg font-publicsansLight opacity-80">
                            {state.description}
                        </Text>
                    )}
                </Animated.View>
            )}
        </>
    );
});

export default ToastMessage;

const styles = StyleSheet.create({});
