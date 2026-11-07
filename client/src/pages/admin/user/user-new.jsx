import { Helmet } from 'react-helmet-async';

import { UserNew } from 'src/sections/admin/user/view';

// --------------------------------------------------------------------------

export default function UserNewPage() {
  return (
    <>
      <Helmet>
        <title>Create a new user | GAMA AirOps </title>
      </Helmet>

      <UserNew />
    </>
  );
}
