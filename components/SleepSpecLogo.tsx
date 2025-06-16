import Svg, { Path } from "react-native-svg";

export default function SleepSpecLogo({ width = 70, height = 56 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 55 41" fill="none">
            <Path
                d="M4 19.1071L4 22.4643"
                stroke="#006EFF"
                strokeWidth={6.71429}
                strokeLinecap="round"
            />
            <Path
                d="M51 20.2262L51 22.4643"
                stroke="#3AC8D9"
                strokeWidth={6.71429}
                strokeLinecap="round"
            />
            <Path
                d="M39.25 9.59521L39.25 30.8571"
                stroke="#006EFF"
                strokeWidth={6.71429}
                strokeLinecap="round"
            />
            <Path
                d="M15.75 3.99997L15.75 30.8571"
                stroke="#3AC8D9"
                strokeWidth={6.71429}
                strokeLinecap="round"
            />
            <Path
                d="M27.5 11.2738L27.5 37.5714"
                stroke="#7800D3"
                strokeWidth={6.71429}
                strokeLinecap="round"
            />
        </Svg>
    );
}
