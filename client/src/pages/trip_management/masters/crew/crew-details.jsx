import { Helmet } from 'react-helmet-async';

import { CrewDetails } from 'src/sections/trip_management/masters/crew/view';

// --------------------------------------------------------------------------

export default function ModelDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Crew Details | GAMA AirOps </title>
      </Helmet>

      <CrewDetails />
    </>
  );
}
