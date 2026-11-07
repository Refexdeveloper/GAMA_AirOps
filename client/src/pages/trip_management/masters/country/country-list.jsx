import { Helmet } from 'react-helmet-async';

import { CountryList } from 'src/sections/trip_management/masters/country/view';

// --------------------------------------------------------------------------

export default function ModelListPage() {
  return (
    <>
      <Helmet>
        <title> Country List | GAMA AirOps </title>
      </Helmet>

      <CountryList />
    </>
  );
}
