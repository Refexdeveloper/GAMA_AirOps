import PropTypes from 'prop-types';
// import styled from 'styled-components';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha, useTheme } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

// import { account } from 'src/_mock/account';

import HoverMenu from 'material-ui-popup-state/HoverMenu';
import PopupState, { bindMenu, bindHover } from 'material-ui-popup-state';

import { usePathname } from 'src/routes/hooks';

import { useDashboardContext } from 'src/context/DashboardContext';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import appNav from './app-navigation';
import adminNav from './admin-navigation';

// ----------------------------------------------------------------------

export default function Nav({ layout }) {
  const pathname = usePathname();
  const theme = useTheme();
  const { openMenu, toggleMenu } = useDashboardContext();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openMenu && !upLg) {
      toggleMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // const renderAccount = (
  //   <Box
  //     sx={{
  //       my: 3,
  //       mx: 2.5,
  //       py: 2,
  //       px: 2.5,
  //       display: 'flex',
  //       borderRadius: 1.5,
  //       alignItems: 'center',
  //       bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
  //     }}
  //   >
  //     <Avatar src={account.photoURL} alt="photoURL" />

  //     <Box sx={{ ml: 2 }}>
  //       <Typography variant="subtitle2">{account.displayName}</Typography>

  //       <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //         {account.role}
  //       </Typography>
  //     </Box>
  //   </Box>
  // );
console.log("layout",layout)
  const renderMenu = (
    <Stack
      component="nav"
      {...(openMenu
        ? {
            spacing: 0.5,
            sx: { px: 2, pb: 4 },
          }
        : {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            pb: 2,
          })}
    >
      {layout === 'app' &&
        appNav.map((con) =>
          openMenu ? (
            <NavContent key={con.title} con={con} />
          ) : (
            con.content.map((popup) => <NavPopup key={popup.title} popup={popup} />)
          )
        )}
      {layout === 'admin' &&
        adminNav.map((con) =>
          openMenu ? (
            <NavContent key={con.title} con={con} />
          ) : (
            con.content.map((popup) => <NavPopup key={popup.title} popup={popup} />)
          )
        )}
    </Stack>
  );

  // const renderUpgrade = (
  //   <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
  //     <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
  //       <Box
  //         component="img"
  //         src="/assets/illustrations/illustration_avatar.png"
  //         sx={{ width: 100, position: 'absolute', top: -50 }}
  //       />

  //       <Box sx={{ textAlign: 'center' }}>
  //         <Typography variant="h6">Get more?</Typography>

  //         <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
  //           From only $69
  //         </Typography>
  //       </Box>

  //       <Button
  //         href="https://material-ui.com/store/items/minimal-dashboard/"
  //         target="_blank"
  //         variant="contained"
  //         color="inherit"
  //       >
  //         Upgrade to Pro
  //       </Button>
  //     </Stack>
  //   </Box>
  // );

  const renderContent = (
    <>
      <Box sx={{ py: 2.62, display: 'flex', justifyContent: 'center' }}>
        <Logo />
      </Box>
      <Scrollbar
        sx={{
          height: 1,
          ...(!openMenu && {
            '& .simplebar-scrollbar': {
              width: '0px',
            },
          }),
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* <Logo sx={{ mt: 3, ml: 4 }} /> */}

        {/* {renderAccount} */}

        {renderMenu}

        {/* <Box sx={{ flexGrow: 1 }} />

      {renderUpgrade} */}
      </Scrollbar>
    </>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: openMenu ? NAV.O_WIDTH : NAV.C_WIDTH },
        transition: theme.transitions.create(['width'], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      <IconButton
        onClick={toggleMenu}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'fixed',
          top: '26px',
          left: openMenu ? '265px' : '73px',
          zIndex: theme.zIndex.drawer + 1,
          padding: '4px',
          border: `dashed 1px ${theme.palette.divider}`,
          backdropFilter: 'blur(6px)',
          transition: theme.transitions.create(['left'], {
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Iconify icon={openMenu ? 'eva:close-fill' : 'eva:menu-2-fill'} />
      </IconButton>
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            width: openMenu ? NAV.O_WIDTH : NAV.C_WIDTH,
            borderRight: `dashed 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openMenu}
          onClose={toggleMenu}
          PaperProps={{
            sx: {
              width: NAV.O_WIDTH,
              transition: theme.transitions.create(['width'], {
                duration: theme.transitions.duration.shorter,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  layout: PropTypes.string,
};

// ----------------------------------------------------------------------

function NavContent({ con, ...other }) {
  // Created By Murugesh Kumar V on 05/03/2024

  const [openContent, setOpenContent] = useState(true);

  const handleClickContent = () => {
    setOpenContent((prev) => !prev);
  };

  return (
    <Box {...other}>
      <List
        component="nav"
        disablePadding
        sx={{ backgroundColor: 'inherit', display: 'flex', flexDirection: 'column' }}
      >
        <ListSubheader
          disableSticky
          // component="li"
          id="nested-list-subheader"
          onClick={handleClickContent}
          sx={{
            display: 'inline-flex',
            height: 42,
            mb: 0.5,
            padding: '16px 8px 8px 12px',
            lineHeight: 1.5,
            fontSize: '0.75rem',
            bgcolor: 'inherit',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          {con.title}
        </ListSubheader>
        <Collapse in={openContent} timeout="auto" unmountOnExit>
          {con.content.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </Collapse>
      </List>
    </Box>
  );
}

NavContent.propTypes = {
  con: PropTypes.object,
};

function NavItem({ item }) {
  // const pathname = usePathname();
  const location = useLocation();

  // const active = item.path === pathname;
  const isChildPath = location.pathname.startsWith(item.path);

  const [openItem, setOpenItem] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClickItem = () => {
    setOpenItem((prev) => !prev);
  };

  return (
    <>
      <ListItemButton
        {...(hasChildren
          ? {
              selected: openItem || isChildPath,
              onClick: handleClickItem,
            }
          : {
              component: RouterLink,
              href: item.path,
            })}
        sx={{
          display: 'flex',
          verticalAlign: 'middle',
          minHeight: 44,
          mb: 0.5,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(isChildPath && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box component="span" flex="1 1 auto" minWidth={0}>
          <Box
            component="span"
            sx={{
              verticalAlign: 'middle',
              width: '100%',  
              maxWidth: '100%',
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              textTransform: 'capitalize',
            }}
          >
            {item.title}
          </Box>
        </Box>
        {hasChildren &&
          (openItem ? (
            <Iconify icon="solar:alt-arrow-up-line-duotone" />
          ) : (
            <Iconify icon="solar:alt-arrow-down-line-duotone" />
          ))}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={openItem} timeout="auto" unmountOnExit>
          {item.children.map((btn) => (
            <NavButton key={btn.title} button={btn} />
          ))}
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavButton({ button }) {
  const location = useLocation();
  const active = location.pathname.startsWith(button.path);

  const SubIcon = styled(Box)(({ theme }) => ({
    width: 24,
    height: 24,
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: 'rgb(99, 115, 129)',
      transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      position: 'absolute',
      ...(active && {
        width: 8,
        height: 8,
        backgroundColor: 'rgb(7, 141, 238)',
      }),
    },
  }));

  return (
    <ListItemButton
      component={RouterLink}
      href={button.path}
      sx={{
        display: 'flex',
        verticalAlign: 'middle',
        minHeight: 44,
        mb: 0.5,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          // bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          // '&:hover': {
          //   bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          // },
        }),
      }}
    >
      {button.icon ? (
        <Box component="span" sx={{ width: 24, height: 24, mx: 2 }}>
          {button.icon}
        </Box>
      ) : (
        <SubIcon />
      )}

      <Box component="span" flex="1 1 auto" minWidth={0}>
        <Box
          component="span"
          sx={{
            verticalAlign: 'middle',
            width: '100%',
            maxWidth: '100%',
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            textTransform: 'capitalize',
          }}
        >
          {button.title}
        </Box>
      </Box>
    </ListItemButton>
  );
}

NavButton.propTypes = {
  button: PropTypes.object,
};

function NavPopup({ popup }) {
  const { title, path, icon, children = [] } = popup;

  // const pathname = usePathname();
  const location = useLocation();

  // const active = path === pathname;
  const isChildPath = location.pathname.startsWith(path);

  const hasChildren = children.length > 0;

  let renderPopup = (
    <Link component={RouterLink} to={path} underline="none" color="inherit">
      <ListItemButton
        disableGutters
        sx={{
          mx: 0.5,
          p: 0.5,
          borderRadius: '6px',
          textTransform: 'capitalize',
          minHeight: 56,
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          ...(isChildPath && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" className="icon" sx={{ width: 24, height: 24, color: 'inherit' }}>
          {icon}
        </Box>
        <Box
          component="span"
          className="label"
          sx={{
            display: 'block',
            minWidth: '100%',
            width: '100%',
            mt: '4px',
            fontSize: 10,
            whiteSpace: 'nowrap',
            lineHeight: '16px',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Box>
      </ListItemButton>
    </Link>
  );

  if (hasChildren) {
    renderPopup = (
      <PopupState variant="popover" popupId="demoMenu">
        {(popupState) => (
          <>
            <Link
              component={RouterLink}
              to={path}
              underline="none"
              color="inherit"
              {...bindHover(popupState)}
            >
              <ListItemButton
                disableGutters
                sx={{
                  mx: 0.5,
                  p: 0.5,
                  borderRadius: '6px',
                  textTransform: 'capitalize',
                  minHeight: 56,
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  ...(isChildPath && {
                    color: 'primary.main',
                    fontWeight: 'fontWeightSemiBold',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  }),
                }}
              >
                <Box
                  component="span"
                  className="icon"
                  sx={{ width: 24, height: 24, color: 'inherit' }}
                >
                  {icon}
                </Box>
                <Box
                  component="span"
                  className="label"
                  sx={{
                    display: 'block',
                    minWidth: '100%',
                    width: '100%',
                    mt: '4px',
                    fontSize: 10,
                    whiteSpace: 'nowrap',
                    lineHeight: '16px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </Box>
                <Iconify
                  className="arrow"
                  icon="eva:arrow-ios-forward-fill"
                  height={16}
                  width={16}
                />
              </ListItemButton>
            </Link>
            <HoverMenu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
            >
              {children.map((child) => {
                const active = location.pathname.startsWith(child.path);
                return (
                  <MenuItem
                    key={child.title}
                    component={RouterLink}
                    to={child.path}
                    sx={{
                      textTransform: 'capitalize',
                      minWidth: 150,
                      m: 0.5,
                      borderRadius: 1,
                      ...(active && {
                        color: 'primary.main',
                        fontWeight: 700,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        },
                      }),
                    }}
                    onClick={popupState.close}
                  >
                    {child.icon && (
                      <ListItemIcon sx={{ color: 'inherit' }}>{child.icon}</ListItemIcon>
                    )}
                    <ListItemText>{child.title}</ListItemText>
                  </MenuItem>
                );
              })}
            </HoverMenu>
          </>
        )}
      </PopupState>
    );
  }

  return renderPopup;
}

NavPopup.propTypes = {
  popup: PropTypes.object,
};
