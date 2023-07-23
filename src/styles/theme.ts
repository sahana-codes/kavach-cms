import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0B0A07', // Customize your primary color here
    },
    secondary: {
      main: '#FFFFFF', // Customize your secondary color here
    },
    background: {
      default: '#E9FC88',
      // paper: '#F8FFD4',
    },
    error: {
      main: '#FF5A10',
    },
    // You can add more colors like 'error', 'warning', 'info', and 'success' here
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightBold: 600,
  },
});

export default theme;
