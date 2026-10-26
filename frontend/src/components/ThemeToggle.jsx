import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle({ variant = 'button', showLabel = false, className = '' }) {
    const { theme, toggleTheme, isDark } = useTheme();

    if (variant === 'switch') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`theme-toggle-switch ${isDark ? 'is-dark' : 'is-light'} ${className}`}
                title={isDark ? "Đổi sang giao diện Sáng (Xanh nhạt phối Trắng)" : "Đổi sang giao diện Tối (Tím bóng đẹp)"}
                aria-label="Chuyển đổi giao diện Sáng / Tối"
            >
                <div className="theme-toggle-switch-track">
                    <span className="theme-toggle-switch-thumb">
                        {isDark ? (
                            <Moon size={13} className="theme-icon-moon" />
                        ) : (
                            <Sun size={13} className="theme-icon-sun" />
                        )}
                    </span>
                    <span className="theme-switch-label-light">Sáng</span>
                    <span className="theme-switch-label-dark">Tối</span>
                </div>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${showLabel ? 'has-label' : ''} ${className}`}
            title={isDark ? "Đổi sang giao diện Sáng (Xanh nhạt phối Trắng)" : "Đổi sang giao diện Tối (Tím bóng đẹp)"}
            aria-label="Chuyển đổi giao diện Sáng / Tối"
        >
            <div className="theme-toggle-icon-wrap">
                {isDark ? (
                    <div className="theme-icon-inner theme-dark-active">
                        <Moon size={16} className="text-purple-300" />
                        <Sparkles size={8} className="theme-sparkle text-purple-200" />
                    </div>
                ) : (
                    <div className="theme-icon-inner theme-light-active">
                        <Sun size={16} className="text-amber-500" />
                    </div>
                )}
            </div>
            {showLabel && (
                <span className="theme-toggle-label">
                    {isDark ? "Tím Tối" : "Xanh Sáng"}
                </span>
            )}
        </button>
    );
}
