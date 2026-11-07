import { Helmet } from 'react-helmet-async';

import { AirportEdit } from 'src/sections/trip_management/masters/airport/view';
// --------------------------------------------------------------------------

export default function AirportEditPage() {
  return (
    <>
      <Helmet>
        <title> Airport Edit | GAMA AirOps </title>
      </Helmet>

      <AirportEdit />
    </>
  );
}
