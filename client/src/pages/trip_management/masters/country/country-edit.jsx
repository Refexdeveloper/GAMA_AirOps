import { Helmet } from 'react-helmet-async';

import { CountryEdit } from 'src/sections/trip_management/masters/country/view';

// --------------------------------------------------------------------------

export default function ModelEditPage() {
  return (
    <>
      <Helmet>
        <title> Country Edit | GAMA AirOps </title>
      </Helmet>

      <CountryEdit />
    </>
  );
}
