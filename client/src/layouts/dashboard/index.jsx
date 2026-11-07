import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import useAuthCheck from 'src/hooks/use-auth-check';

import Nav from './nav';
import Main from './main';
import Header from './header';
import Footer from './footer';

// ----------------------------------------------------------------------

// const DashboardLayout = ({ layout = 'app', openMenu, toggleMenu, children }) => (
//   <>
//     <Header openMenu={openMenu} onSwitchMenu={toggleMenu} />

//     <Box
//       sx={{
//         minHeight: 1,
//         display: 'flex',
//         flexDirection: { xs: 'column', lg: 'row' },
//       }}
//     >
//       <Nav layout={layout} openMenu={openMenu} onSwitchMenu={toggleMenu} />

//       <Main>{children}</Main>
//     </Box>
//     <Footer sx={{ pb: 3 }} />
//   </>
// );

// DashboardLayout.propTypes = {
//   layout: PropTypes.string,
//   openMenu: PropTypes.bool,
//   toggleMenu: PropTypes.func,
//   children: PropTypes.node,
// };

// export default memo(DashboardLayout);
export default function DashboardLayout({ layout = 'app', children }) {
  useAuthCheck();
  return (
    <>
      <Header layout={layout} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav layout={layout} />

        <Main>{children}</Main>
      </Box>
      <Footer sx={{ pb: 3 }} />
    </>
  );
}

DashboardLayout.propTypes = {
  layout: PropTypes.string,
  children: PropTypes.node,
};
