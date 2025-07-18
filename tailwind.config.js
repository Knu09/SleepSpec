/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],

    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#7800D3",
                secondary: "#DDDDDD",
                primaryBlue: "#006FFF",
                danger: "#FF2121",
                darkBg: "#01000F",
                lightBg: "#F1F5FD",
                darkGray: "#32322F",
                lightWhite: "#808080",
                arsenic: "#1F242A",
                darkLayer: "#161B21",
                grayLayer: "#EEF0F1",
                divider: "#585858",
                lightGray: "#E9E9E9",
                success: "#3DC13C",
                info: "#3598DB",
                active: "#6EDB3F",
                warning: "#F39C11",
                error: "#E84C3D",
                idle: "#9E9E9E",
            },
            fontFamily: {
                poppins: ["Poppins"],
                poppinsRegular: ["Poppins-Regular"],
                poppinsMedium: ["Poppins-Medium"],
                poppinsBold: ["Poppins-Bold"],
                pulicsansLight: ["PublicSans-Light"],
                publicsans: ["PublicSans-Regular"],
                publicsansBold: ["PublicSans-Bold"],
            },
        },
    },
    plugins: [],
};
