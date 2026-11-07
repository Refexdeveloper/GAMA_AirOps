import { Helmet } from 'react-helmet-async';

import { CityDetails } from 'src/sections/trip_management/masters/city/view'
// --------------------------------------------------------------------------

export default function ModelNewPage() {
  return (
    <>
      <Helmet>
        <title> View  City | GAMA AirOps </title>
      </Helmet>

      <CityDetails />
    </>
  );
}
