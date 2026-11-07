import { Helmet } from 'react-helmet-async';

import { ModelDetails } from 'src/sections/trip_management/masters/aircraft_model/view';

// --------------------------------------------------------------------------

export default function ModelDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft Model Details | GAMA AirOps </title>
      </Helmet>

      <ModelDetails />
    </>
  );
}
