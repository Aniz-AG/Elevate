import React from 'react';
import { CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { DataProvider } from './Context/DataContext.jsx';
import App from './App';

// Create a custom theme using MUI's createTheme function
const theme = createTheme({
  palette: {
    mode: 'dark',  // Set the theme to dark mode, can be changed to light
    primary: {
      main: '#1976d2', // Primary color example
    },
    secondary: {
      main: '#f50057', // Secondary color example
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif', // Set default font family
  },
});

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DataProvider>
      <Router>
        {/* Wrap the entire application in the MUI ThemeProvider */}
        <ThemeProvider theme={theme}>
          {/* Global CSS reset with CssBaseline */}
          <CssBaseline />
          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%' }}>
            <App />
          </Box>
        </ThemeProvider>
      </Router>
    </DataProvider>
  </React.StrictMode>
);
