import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | GAMA AirOps </title>
      </Helmet>

      <AppView />
    </>
  );
}
