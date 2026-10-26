import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Lấy theme đã lưu hoặc mặc định là 'light' (xanh nhẹ phối trắng)
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('app_theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                return savedTheme;
            }
            return 'light'; // Mặc định xanh nhạt phối trắng
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('app_theme', theme);
        } catch (e) {
            console.error('Failed to save theme to localStorage:', e);
        }

        const root = document.documentElement;
        root.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback an toàn nếu component nằm ngoài provider
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            theme: isDark ? 'dark' : 'light',
            setTheme: () => {},
            toggleTheme: () => {},
            isDark
        };
    }
    return context;
}

export default ThemeContext;
