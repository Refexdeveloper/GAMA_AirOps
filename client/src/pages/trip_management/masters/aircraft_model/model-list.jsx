import { Helmet } from 'react-helmet-async';

import { ModelList } from 'src/sections/trip_management/masters/aircraft_model/view';

// --------------------------------------------------------------------------

export default function ModelListPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft Model List | GAMA AirOps </title>
      </Helmet>

      <ModelList />
    </>
  );
}
