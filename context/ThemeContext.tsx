import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingKeys from "@/constants/setting_keys";

type ThemeContextType = {
    currentTheme: string;
    toggleTheme: (newTheme: string) => void;
};
export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: "dark",
    toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<string>("dark");

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

    const toggleTheme = async (newTheme: string) => {
        try {
            await AsyncStorage.setItem(SettingKeys.APP_THEME, newTheme);
            setTheme(newTheme);
        } catch (error) {}
    };

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
