import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import createAppTheme from '../styles/theme';

// Create context
const ThemeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  // Get user preference from localStorage or default to light
  const storedMode = localStorage.getItem('themeMode') || 'light';
  const [mode, setMode] = useState(storedMode);

  // Toggle theme function
  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Create the theme based on current mode
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
