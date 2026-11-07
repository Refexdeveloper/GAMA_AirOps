import { Helmet } from 'react-helmet-async';

import { AircraftEdit } from 'src/sections/trip_management/masters/aircraft/view';

// --------------------------------------------------------------------------

export default function AircraftEditPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft Edit | GAMA AirOps </title>
      </Helmet>

      <AircraftEdit />
    </>
  );
}
