import { Helmet } from 'react-helmet-async';

import { NSOPQuotationEdit } from 'src/sections/sales_management/nsop_quotation/view';

// --------------------------------------------------------------------------

export default function NSOPQuotationEditPage() {
  return (
    <>
      <Helmet>
        <title> Edit NSOP Quotation | GAMA AirOps </title>
      </Helmet>

      <NSOPQuotationEdit />
    </>
  );
}
