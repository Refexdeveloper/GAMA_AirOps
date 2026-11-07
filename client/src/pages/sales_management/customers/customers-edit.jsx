import { Helmet } from 'react-helmet-async';

import { CustomersEdit } from 'src/sections/sales_management/customers/view';

// --------------------------------------------------------------------------

export default function CustomersEditPage() {
  return (
    <>
      <Helmet>
        <title> Customer Edit | GAMA AirOps </title>
      </Helmet>

      <CustomersEdit />
    </>
  );
}
