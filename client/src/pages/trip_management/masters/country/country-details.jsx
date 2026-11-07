import { Helmet } from 'react-helmet-async';

import { CountryDetails } from 'src/sections/trip_management/masters/country/view'
// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> View  Country | GAMA AirOps </title>
      </Helmet>

      <CountryDetails />
    </>
  );
}
