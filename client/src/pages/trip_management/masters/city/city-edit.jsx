import { Helmet } from 'react-helmet-async';

import { CityEdit } from 'src/sections/trip_management/masters/city/view';

// --------------------------------------------------------------------------

export default function ModelEditPage() {
  return (
    <>
      <Helmet>
        <title> City Edit | GAMA AirOps </title>
      </Helmet>

      <CityEdit />
    </>
  );
}
