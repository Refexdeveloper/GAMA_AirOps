import { Helmet } from 'react-helmet-async';

import { AircraftNew } from 'src/sections/trip_management/masters/aircraft/view';

// --------------------------------------------------------------------------

export default function AircraftNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new aircraft | GAMA AirOps </title>
      </Helmet>

      <AircraftNew />
    </>
  );
}
