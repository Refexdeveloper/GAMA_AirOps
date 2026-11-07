import { Helmet } from 'react-helmet-async';

import { PIConvert } from 'src/sections/sales_management/proforma_invoice/view';

// --------------------------------------------------------------------------

export default function PIListPage() {
  return (
    <>
      <Helmet>
        <title> Convert To Proforma Invoice | GAMA AirOps </title>
      </Helmet>

      <PIConvert />
    </>
  );
}
