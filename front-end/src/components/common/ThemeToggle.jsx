import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { WbSunny, NightsStay } from '@mui/icons-material';

const StyledToggle = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  transform: 'scale(1)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '& svg': {
    transition: 'all 0.3s ease',
    transform: 'rotate(0deg)',
  },
  '&:hover svg': {
    transform: 'rotate(30deg)',
  },
}));

const ThemeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ThemeContext);

  return (
    <StyledToggle
      onClick={toggleColorMode}
      color="inherit"
      aria-label={theme.palette.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme.palette.mode === 'dark' ? <WbSunny /> : <NightsStay />}
    </StyledToggle>
  );
};

export default ThemeToggle;
