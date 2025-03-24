/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#7800D3",
                secondary: "#DDDDDD",
                primaryBlue: "#006FFF",
                danger: "#FF2121",
                darkBg: "#01000F",
                lightWhite: "#808080",
            },
            fontFamily: {
                poppins: ["Poppins-Regular"],
                poppinsBold: ["Poppins-Bold"],
                publicsans: ["PublicSans-Regular"],
                publicsansBold: ["PublicSans-Bold"],
            },
        },
    },
    plugins: [],
};
