import { CssBaseline } from '@mui/material';
import '../styles/globals.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

function MyApp({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}

export default MyApp;
