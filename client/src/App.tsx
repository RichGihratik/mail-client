import { ThemeProvider, createTheme } from '@mui/material';
import { Router } from './router';
import { RecoilRoot } from 'recoil';

const theme = createTheme({
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
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  );
}
