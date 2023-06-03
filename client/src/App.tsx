import { ThemeProvider, createTheme } from '@mui/material';
import { Router } from './router';
import RecoilNexus from 'recoil-nexus';
import { RecoilRoot } from 'recoil';

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 60,
        },
      },
    },
  },
});

export default function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  );
}
