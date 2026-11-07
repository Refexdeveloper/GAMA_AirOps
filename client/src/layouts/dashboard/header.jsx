import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useDashboardContext } from 'src/context/DashboardContext';

import Iconify from 'src/components/iconify';

import { NAV, HEADER } from './config-layout';
import { SETTINGS_SUBNAV } from './admin-navigation';
import AccountPopover from './common/account-popover';

// ----------------------------------------------------------------------

function SettingsHeaderLinks({ pathname }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: { xs: 0, sm: 2 } }}>
      {SETTINGS_SUBNAV.map((item) => {
        const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
        return (
          <Link
            key={item.path}
            component={RouterLink}
            href={item.path}
            underline="none"
            variant="subtitle2"
            sx={{
              color: active ? 'primary.main' : 'text.secondary',
              fontWeight: active ? 700 : 500,
              whiteSpace: 'nowrap',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {item.title}
          </Link>
        );
      })}
    </Stack>
  );
}

SettingsHeaderLinks.propTypes = {
  pathname: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function Header({ window, layout = 'app' }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { openMenu, toggleMenu } = useDashboardContext();

  const lgUp = useResponsive('up', 'lg');

  const isScroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 35,
    target: window ? window() : undefined,
  });

  const showSettingsLinks = layout === 'admin' && pathname.startsWith('/admin/settings');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={toggleMenu} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {showSettingsLinks && <SettingsHeaderLinks pathname={pathname} />}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        ...(lgUp && {
          width: `calc(100% - ${openMenu ? NAV.O_WIDTH + 1 : NAV.C_WIDTH + 1}px)`,
          height: isScroll ? HEADER.H_DESKTOP_OFFSET : HEADER.H_DESKTOP,
          transition: theme.transitions.create(['width', 'height'], {
            duration: theme.transitions.duration.shorter,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  window: PropTypes.func,
  layout: PropTypes.string,
};
