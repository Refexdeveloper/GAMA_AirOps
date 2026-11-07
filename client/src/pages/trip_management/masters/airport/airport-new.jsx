import { Helmet } from 'react-helmet-async';

import { AirportNew } from 'src/sections/trip_management/masters/airport/view';

// --------------------------------------------------------------------------

export default function AirportNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new airport | GAMA AirOps </title>
      </Helmet>

      <AirportNew />
    </>
  );
}
