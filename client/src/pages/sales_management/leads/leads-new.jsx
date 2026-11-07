import { Helmet } from 'react-helmet-async';

import { LeadsNew } from 'src/sections/sales_management/leads/view';

// --------------------------------------------------------------------------

export default function LeadsNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new lead | GAMA AirOps </title>
      </Helmet>

      <LeadsNew />
    </>
  );
}
