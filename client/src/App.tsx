import { ThemeProvider, createTheme } from '@mui/material';
import { Router } from './router';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 50,
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}
