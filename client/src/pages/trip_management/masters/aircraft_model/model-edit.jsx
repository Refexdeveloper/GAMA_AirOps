import { Helmet } from 'react-helmet-async';

import { ModelEdit } from 'src/sections/trip_management/masters/aircraft_model/view';

// --------------------------------------------------------------------------

export default function ModelEditPage() {
  return (
    <>
      <Helmet>
        <title> Aircraft Model Edit | GAMA AirOps </title>
      </Helmet>

      <ModelEdit />
    </>
  );
}
