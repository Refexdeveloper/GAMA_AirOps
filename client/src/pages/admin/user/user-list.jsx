import { Helmet } from 'react-helmet-async';

import { UserList } from 'src/sections/admin/user/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> User List | GAMA AirOps </title>
      </Helmet>

      <UserList />
    </>
  );
}
