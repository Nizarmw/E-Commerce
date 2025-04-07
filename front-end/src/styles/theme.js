import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

// Remove all @fontsource imports and replace with baseTheme configuration
const baseTheme = {
  palette: {
    primary: {
      main: '#1A237E', // Navy Blue
      light: '#4A51A8',
      dark: '#000051',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFCA28', // Soft Gold/Mustard
      light: '#FFF350',
      dark: '#C79A00',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4A51A8',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#FFF350',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1A237E',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
};

// Light theme specific settings
const lightTheme = deepmerge(baseTheme, {
  palette: {
    mode: 'light',
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
});

// Dark theme specific settings
const darkTheme = deepmerge(baseTheme, {
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
    primary: {
      main: '#3F51B5', // Slightly lighter shade for dark mode
    },
    secondary: {
      main: '#FFD54F', // Slightly brighter for dark mode
    },
  },
});

// Create and export the themes
export const createAppTheme = (mode) => {
  return mode === 'dark' ? createTheme(darkTheme) : createTheme(lightTheme);
};

export default createAppTheme;
