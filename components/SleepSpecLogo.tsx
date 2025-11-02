import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const CustomSVG = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={273}
        height={252}
        viewBox="0 0 273 252"
        fill="none"
        {...props}
    >
        <Path
            d="M57.3521 114.578L57.3521 125.878"
            stroke="#006EFF"
            strokeWidth={22.6008}
            strokeLinecap="round"
        />
        <Path
            d="M215.558 118.345L215.558 125.878"
            stroke="#3AC8D9"
            strokeWidth={22.6008}
            strokeLinecap="round"
        />
        <Path
            d="M176.006 82.56L176.006 154.129"
            stroke="#006EFF"
            strokeWidth={22.6008}
            strokeLinecap="round"
        />
        <Path
            d="M96.9033 63.726L96.9033 154.129"
            stroke="#3AC8D9"
            strokeWidth={22.6008}
            strokeLinecap="round"
        />
        <Path
            d="M136.455 88.2103L136.455 176.73"
            stroke="#7800D3"
            strokeWidth={22.6008}
            strokeLinecap="round"
        />
        <Path
            d="M264.791 74.485L264.791 7.84051L207.947 7.84051"
            stroke="url(#paint0_linear_1226_509)"
            strokeWidth={15.6811}
            strokeLinecap="round"
        />
        <Path
            d="M7.84058 177.382L7.84058 244.026L66.6445 244.026"
            stroke="url(#paint1_linear_1226_509)"
            strokeWidth={15.6811}
            strokeLinecap="round"
        />
        <Path
            d="M206.037 244.076H254.06C257.653 244.076 264.841 241.92 264.841 233.295C264.841 224.671 264.841 191.152 264.841 175.471"
            stroke="url(#paint2_linear_1226_509)"
            strokeWidth={15.6811}
            strokeLinecap="round"
        />
        <Path
            d="M66.6445 7.84058L18.6213 7.84058C15.0277 7.84058 7.84058 9.99672 7.84058 18.6213C7.84058 27.2459 7.84058 60.7641 7.84058 76.4452"
            stroke="url(#paint3_linear_1226_509)"
            strokeWidth={15.6811}
            strokeLinecap="round"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_1226_509"
                x1="181.841"
                y1="87.8405"
                x2="264.841"
                y2="7.84042"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#006FFF" />
                <Stop offset={1} stopColor="#3AC8D9" />
            </LinearGradient>
            <LinearGradient
                id="paint1_linear_1226_509"
                x1="7.84058"
                y1="243.84"
                x2="98.3406"
                y2="154.84"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#006FFF" />
                <Stop offset={1} stopColor="#3AC8D9" />
            </LinearGradient>
            <LinearGradient
                id="paint2_linear_1226_509"
                x1="173.841"
                y1="145.84"
                x2="264.841"
                y2="243.84"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#006FFF" />
                <Stop offset={1} stopColor="#3AC8D9" />
            </LinearGradient>
            <LinearGradient
                id="paint3_linear_1226_509"
                x1="7.84059"
                y1="7.84058"
                x2="102.341"
                y2="83.3405"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#006FFF" />
                <Stop offset={1} stopColor="#3AC8D9" />
            </LinearGradient>
        </Defs>
    </Svg>
);

export default CustomSVG;
