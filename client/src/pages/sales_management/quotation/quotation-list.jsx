import { Helmet } from 'react-helmet-async';

import { QuotationList } from 'src/sections/sales_management/quotation/view';

// --------------------------------------------------------------------------

export default function QuotationListPage() {
  return (
    <>
      <Helmet>
        <title> Quotation List | GAMA AirOps </title>
      </Helmet>

      <QuotationList />
    </>
  );
}
