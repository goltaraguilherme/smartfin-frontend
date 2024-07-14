import { createContext, useContext, useState } from 'react';

interface DarkThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkThemeContext = createContext<DarkThemeContextType>({
  isDark: false,
  toggleDarkMode: () => {},
});

export function DarkThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setDarkModeToggle] = useState<boolean>(false);

  const toggleDarkMode = () => {
    console.log(!isDark)
    setDarkModeToggle(!isDark)
  }

  return (
    <DarkThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkThemeContext.Provider>
  );
}

export function useDarkTheme() {
  return useContext(DarkThemeContext);
}
