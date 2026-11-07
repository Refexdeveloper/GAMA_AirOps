import { Helmet } from 'react-helmet-async';

import { UserDetails } from 'src/sections/admin/user/view/';

// --------------------------------------------------------------------------

export default function CustomersDetailsPage() {
  return (
    <>
      <Helmet>
        <title> User Details | GAMA AirOps </title>
      </Helmet>

      <UserDetails />
    </>
  );
}
