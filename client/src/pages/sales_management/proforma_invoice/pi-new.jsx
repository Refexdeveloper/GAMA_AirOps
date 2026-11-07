import { Helmet } from 'react-helmet-async';

import { PINew } from 'src/sections/sales_management/proforma_invoice/view';

// --------------------------------------------------------------------------

export default function PINewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new proforma invoice | GAMA AirOps </title>
      </Helmet>

      <PINew />
    </>
  );
}
