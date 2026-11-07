import { Helmet } from 'react-helmet-async';

import { LeadsEdit } from 'src/sections/sales_management/leads/view';

// --------------------------------------------------------------------------

export default function LeadsEditPage() {
  return (
    <>
      <Helmet>
        <title> Lead Edit | GAMA AirOps </title>
      </Helmet>

      <LeadsEdit />
    </>
  );
}
