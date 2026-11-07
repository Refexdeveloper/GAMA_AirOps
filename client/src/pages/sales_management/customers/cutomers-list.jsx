import { Helmet } from 'react-helmet-async';

import { CustomersList } from 'src/sections/sales_management/customers/view';

// --------------------------------------------------------------------------

export default function CustomrsListPage() {
  return (
    <>
      <Helmet>
        <title> Customers List | GAMA AirOps </title>
      </Helmet>

      <CustomersList />
    </>
  );
}
