import { Helmet } from 'react-helmet-async';

import { CustomersNew } from 'src/sections/sales_management/customers/view';

// --------------------------------------------------------------------------

export default function LeadsNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new customer | GAMA AirOps </title>
      </Helmet>

      <CustomersNew />
    </>
  );
}
