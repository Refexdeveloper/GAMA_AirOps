import { Helmet } from 'react-helmet-async';

import { QuotationDetails } from 'src/sections/sales_management/quotation/view';

// --------------------------------------------------------------------------

export default function QuotationDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Quotation Details | GAMA AirOps </title>
      </Helmet>

      <QuotationDetails />
    </>
  );
}
