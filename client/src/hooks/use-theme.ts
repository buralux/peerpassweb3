import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    // If there's a stored preference, use it
    if (storedTheme) {
      return storedTheme;
    }
    
    // Otherwise, check for system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "system";
    }
    
    // Default to light
    return "light";
  });

  // Apply theme to document
  useEffect(() => {
    const isDark = 
      theme === "dark" || 
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    document.documentElement.classList.toggle("dark", isDark);
    
    // Store the preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Function to toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === "dark") return "light";
      if (prev === "light") return "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
    });
  };

  // Function to set specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, toggleTheme, setTheme };
}
