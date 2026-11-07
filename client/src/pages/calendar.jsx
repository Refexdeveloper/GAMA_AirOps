import { Helmet } from 'react-helmet-async';

import { Calendar } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Calendar | GAMA AirOps </title>
      </Helmet>

      <Calendar />
    </>
  );
}
