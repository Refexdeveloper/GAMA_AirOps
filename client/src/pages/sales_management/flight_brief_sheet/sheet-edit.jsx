import { Helmet } from 'react-helmet-async';

import { SheetEdit } from 'src/sections/sales_management/flight_brief_sheet/view';

// --------------------------------------------------------------------------

export default function SheetNewPage() {
  return (
    <>
      <Helmet>
        <title> Flight Brief Sheet Edit | GAMA AirOps </title>
      </Helmet>

      <SheetEdit />
    </>
  );
}
