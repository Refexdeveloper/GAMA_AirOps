import { Helmet } from 'react-helmet-async';

import { CrewEdit } from 'src/sections/trip_management/masters/crew/view';

// --------------------------------------------------------------------------

export default function ModelEditPage() {
  return (
    <>
      <Helmet>
        <title> Crew Edit | GAMA AirOps </title>
      </Helmet>

      <CrewEdit />
    </>
  );
}
