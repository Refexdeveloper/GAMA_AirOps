import { Helmet } from 'react-helmet-async';

import { SheetList } from 'src/sections/sales_management/flight_brief_sheet/view';

// --------------------------------------------------------------------------

export default function SheetListPage() {
  return (
    <>
      <Helmet>
        <title> Flight Brief Sheet List | GAMA AirOps </title>
      </Helmet>

      <SheetList />
    </>
  );
}
