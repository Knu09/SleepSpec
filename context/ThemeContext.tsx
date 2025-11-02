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
                // FIX: asyncing theme to storage is too slow to process.
                const savedTheme = await AsyncStorage.getItem(
                    SettingKeys.APP_THEME,
                );
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (error) {}
        };
        loadTheme();
    }, []);

    useEffect(() => {
        if (colorScheme) {
            setTheme(colorScheme);
            AsyncStorage.setItem(SettingKeys.APP_THEME, colorScheme);
        }
    }, [colorScheme]);

    const toggleTheme = async (newTheme: string) => {
        try {
            await AsyncStorage.setItem(SettingKeys.APP_THEME, newTheme);
            setTheme(newTheme);
            setSystemTheme(false);
        } catch (error) {}
    };

    const useSystemTheme = () => {
        if (colorScheme) {
            AsyncStorage.setItem(SettingKeys.APP_THEME, colorScheme);
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
