/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Routes from 'src/routes/routes';
import ThemeProvider from 'src/theme';
import { DashboardProvider } from 'src/context/DashboardContext';

import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <DashboardProvider>
            <Routes />
          </DashboardProvider>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
