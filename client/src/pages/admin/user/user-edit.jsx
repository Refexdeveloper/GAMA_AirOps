import { Helmet } from 'react-helmet-async';

import { UserEdit } from 'src/sections/admin/user/view';

// --------------------------------------------------------------------------

export default function UserNewPage() {
  return (
    <>
      <Helmet>
        <title> User Edit | GAMA AirOps </title>
      </Helmet>

      <UserEdit />
    </>
  );
}
