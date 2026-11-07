import { Helmet } from 'react-helmet-async';

import { QuotationEdit } from 'src/sections/sales_management/quotation/view';

// --------------------------------------------------------------------------

export default function QuotationEditPage() {
  return (
    <>
      <Helmet>
        <title> Quotation Edit | GAMA AirOps </title>
      </Helmet>

      <QuotationEdit />
    </>
  );
}
