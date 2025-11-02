import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingKeys from "@/constants/setting_keys";
import { useColorScheme } from "react-native";

type ThemeContextType = {
    isSystemTheme: boolean;
    currentTheme: string;
    toggleTheme: (newTheme: string) => void;
    useSystemTheme: () => void;
};
export const ThemeContext = createContext<ThemeContextType>({
    isSystemTheme: false,
    currentTheme: "dark",
    toggleTheme: () => {},
    useSystemTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState<string>("dark");
    const [systemTheme, setSystemTheme] = useState<boolean>(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedThemeObject = await AsyncStorage.getItem(
                    SettingKeys.APP_THEME,
                );
                const savedThemeObjectData = JSON.parse(savedThemeObject!);
                if (savedThemeObjectData) {
                    setTheme(savedThemeObjectData.mode);
                    setSystemTheme(savedThemeObjectData.system);
                }
            } catch (error) {}
        };
        loadTheme();
    }, []);

    useEffect(() => {
        if (colorScheme && systemTheme) {
            const themeObject = {
                mode: colorScheme,
                system: true,
            };
            setTheme(colorScheme);
            AsyncStorage.setItem(
                SettingKeys.APP_THEME,
                JSON.stringify(themeObject),
            );
            setSystemTheme(true);
        }
    }, [colorScheme]);

    const toggleTheme = async (newTheme: string) => {
        try {
            const themeObject = {
                mode: newTheme,
                system: false,
            };
            setTheme(newTheme);
            await AsyncStorage.setItem(
                SettingKeys.APP_THEME,
                JSON.stringify(themeObject),
            );
            setSystemTheme(false);
        } catch (error) {}
    };

    const useSystemTheme = () => {
        if (colorScheme) {
            const themeObject = {
                mode: colorScheme,
                system: true,
            };
            AsyncStorage.setItem(
                SettingKeys.APP_THEME,
                JSON.stringify(themeObject),
            );
            setTheme(colorScheme);
            setSystemTheme(true);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                currentTheme: theme,
                toggleTheme,
                useSystemTheme,
                isSystemTheme: systemTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
