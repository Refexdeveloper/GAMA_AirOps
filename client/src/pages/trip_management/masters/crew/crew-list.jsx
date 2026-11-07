import { Helmet } from 'react-helmet-async';

import { CrewList } from 'src/sections/trip_management/masters/crew/view';

// --------------------------------------------------------------------------

export default function ModelListPage() {
  return (
    <>
      <Helmet>
        <title> Crew List | GAMA AirOps </title>
      </Helmet>

      <CrewList />
    </>
  );
}
