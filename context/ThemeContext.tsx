import { createContext, ReactNode, useState } from "react";

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

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
