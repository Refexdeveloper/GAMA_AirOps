import { Helmet } from 'react-helmet-async';

import { CrewNew } from 'src/sections/trip_management/masters/crew/view';

// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new crew | GAMA AirOps </title>
      </Helmet>

      <CrewNew />
    </>
  );
}
