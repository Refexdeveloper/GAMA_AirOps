import { Helmet } from 'react-helmet-async';

import { PIEdit } from 'src/sections/sales_management/proforma_invoice/view';

// --------------------------------------------------------------------------

export default function PIEditPage() {
  return (
    <>
      <Helmet>
        <title> Proforma Invoice Edit | GAMA AirOps </title>
      </Helmet>

      <PIEdit />
    </>
  );
}
