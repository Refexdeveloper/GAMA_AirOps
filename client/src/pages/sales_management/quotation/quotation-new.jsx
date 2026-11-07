import { Helmet } from 'react-helmet-async';

import { QuotationNew } from 'src/sections/sales_management/quotation/view';

// --------------------------------------------------------------------------

export default function QuotationNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new quotation | GAMA AirOps </title>
      </Helmet>

      <QuotationNew />
    </>
  );
}
