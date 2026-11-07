import { Helmet } from 'react-helmet-async';

import { CityList } from 'src/sections/trip_management/masters/city/view';

// --------------------------------------------------------------------------

export default function ModelListPage() {
  return (
    <>
      <Helmet>
        <title> City List | GAMA AirOps </title>
      </Helmet>

      <CityList />
    </>
  );
}
