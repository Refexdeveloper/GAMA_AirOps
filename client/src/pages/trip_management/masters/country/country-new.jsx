import { Helmet } from 'react-helmet-async';

import { CountryNew } from 'src/sections/trip_management/masters/country/view'
// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new Country | GAMA AirOps </title>
      </Helmet>

      <CountryNew />
    </>
  );
}
