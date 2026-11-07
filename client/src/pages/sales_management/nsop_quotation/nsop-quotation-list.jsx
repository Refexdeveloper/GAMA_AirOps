import { Helmet } from 'react-helmet-async';

import { NSOPQuotationList } from 'src/sections/sales_management/nsop_quotation/view';

// --------------------------------------------------------------------------

export default function QuotationListPage() {
  return (
    <>
      <Helmet>
        <title> NSOP Quotation List | GAMA AirOps </title>
      </Helmet>

      <NSOPQuotationList />
    </>
  );
}
