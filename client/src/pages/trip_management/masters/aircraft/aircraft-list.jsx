import { Helmet } from 'react-helmet-async';

import { AircraftList } from 'src/sections/trip_management/masters/aircraft/view';

// --------------------------------------------------------------------------

export default function AircraftListPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft List | GAMA AirOps </title>
      </Helmet>

      <AircraftList />
    </>
  );
}
