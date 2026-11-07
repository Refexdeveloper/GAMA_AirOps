import { Helmet } from 'react-helmet-async';

import { AirportDetails } from 'src/sections/trip_management/masters/airport/view';

// --------------------------------------------------------------------------

export default function AirportDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Airport Details | GAMA AirOps </title>
      </Helmet>

      <AirportDetails />
    </>
  );
}
