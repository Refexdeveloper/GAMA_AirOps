import { Helmet } from 'react-helmet-async';

import { PIList } from 'src/sections/sales_management/proforma_invoice/view';

// --------------------------------------------------------------------------

export default function PIListPage() {
  return (
    <>
      <Helmet>
        <title> Proforma Invoice List | GAMA AirOps </title>
      </Helmet>

      <PIList />
    </>
  );
}
