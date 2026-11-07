import { Helmet } from 'react-helmet-async';

import { AirportList } from 'src/sections/trip_management/masters/airport/view';

// --------------------------------------------------------------------------

export default function AirportListPage() {
  return (
    <>
      <Helmet>
        <title> Airport List | GAMA AirOps </title>
      </Helmet>

      <AirportList />
    </>
  );
}
