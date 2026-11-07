import { Helmet } from 'react-helmet-async';

import { NSOPQuotationNew } from 'src/sections/sales_management/nsop_quotation/view';

// --------------------------------------------------------------------------

export default function NSOPQuotationNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new NSOP Quotation | GAMA AirOps </title>
      </Helmet>

      <NSOPQuotationNew />
    </>
  );
}
