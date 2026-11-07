import { Helmet } from 'react-helmet-async';

import { AircraftDetails } from 'src/sections/trip_management/masters/aircraft/view';

// --------------------------------------------------------------------------

export default function AircraftDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft Details | GAMA AirOps </title>
      </Helmet>

      <AircraftDetails />
    </>
  );
}
