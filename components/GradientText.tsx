import React from "react";
import Svg, {
    Defs,
    LinearGradient,
    Mask,
    Rect,
    Stop,
    Text as SvgText,
} from "react-native-svg";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function GradientText({ text = "Gradient Text", fontSize }) {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require(
            "../assets/fonts/Poppins/Poppins-Regular.ttf",
        ),
        "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
        "PublicSans-Regular": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Regular.ttf",
        ),
        "PublicSans-Bold": require(
            "../assets/fonts/Public_Sans/static/PublicSans-Bold.ttf",
        ),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;
    return (
        <View>
            <Svg height={fontSize + 20} width={text.length * fontSize * 0.55}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#006EFF" stopOpacity="1" />
                        <Stop
                            offset="0.5"
                            stopColor="#3AC8D9"
                            stopOpacity="1"
                        />
                        <Stop offset="1" stopColor="#7800D3" stopOpacity="1" />
                    </LinearGradient>
                    <Mask id="mask">
                        <SvgText
                            fill="white"
                            fontSize={fontSize}
                            fontWeight="bolder"
                            fontFamily="Poppins-Regular"
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            {text}
                        </SvgText>
                    </Mask>
                </Defs>
                <Rect
                    width="100%"
                    height="100%"
                    fill="url(#grad)"
                    mask="url(#mask)"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({});
