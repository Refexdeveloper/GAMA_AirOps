import { Helmet } from 'react-helmet-async';

import { LeadsDetails } from 'src/sections/sales_management/leads/view';

// --------------------------------------------------------------------------

export default function LeadsDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Lead Details | GAMA AirOps </title>
      </Helmet>

      <LeadsDetails />
    </>
  );
}
