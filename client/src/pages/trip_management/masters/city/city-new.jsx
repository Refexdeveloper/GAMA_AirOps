import { Helmet } from 'react-helmet-async';

import { CityNew } from 'src/sections/trip_management/masters/city/view'
// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> Create a new City | GAMA AirOps </title>
      </Helmet>

      <CityNew />
    </>
  );
}
