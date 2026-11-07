import { Helmet } from 'react-helmet-async';

import { LeadsList } from 'src/sections/sales_management/leads/view';

// --------------------------------------------------------------------------

export default function LeadsListPage() {
  return (
    <>
      <Helmet>
        <title> Leads List | GAMA AirOps </title>
      </Helmet>

      <LeadsList />
    </>
  );
}
