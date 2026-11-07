import { Helmet } from 'react-helmet-async';

import { CustomersDetails } from 'src/sections/sales_management/customers/view';

// --------------------------------------------------------------------------

export default function CustomersDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Customer Details | GAMA AirOps </title>
      </Helmet>

      <CustomersDetails />
    </>
  );
}
