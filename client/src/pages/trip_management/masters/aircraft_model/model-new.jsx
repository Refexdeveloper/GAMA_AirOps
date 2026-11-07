import { Helmet } from 'react-helmet-async';

import { ModelNew } from 'src/sections/trip_management/masters/aircraft_model/view';

// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new aircraft model | GAMA AirOps </title>
      </Helmet>

      <ModelNew />
    </>
  );
}
