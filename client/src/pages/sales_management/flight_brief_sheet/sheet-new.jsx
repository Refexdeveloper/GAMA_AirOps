import { Helmet } from 'react-helmet-async';

import { SheetNew } from 'src/sections/sales_management/flight_brief_sheet/view';

// --------------------------------------------------------------------------

export default function SheetNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new flight brief sheet | GAMA AirOps </title>
      </Helmet>

      <SheetNew />
    </>
  );
}
