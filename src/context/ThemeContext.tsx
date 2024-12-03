"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextProps {
    theme: string;
    setTheme: (newTheme: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        const savedTheme = Cookies.get("theme") || "light";
        setTheme(savedTheme); // Set theme from localStorage
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.documentElement.classList.add(savedTheme);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        Cookies.set("theme", newTheme, { expires: 365 });
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    if (!theme) {
        return null; // Avoid rendering until theme is determined to prevent flickering
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
