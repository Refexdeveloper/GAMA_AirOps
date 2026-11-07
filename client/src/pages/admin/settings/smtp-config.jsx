import { Helmet } from 'react-helmet-async';

import { SmtpConfigView } from 'src/sections/admin/settings';

export default function SmtpConfigPage() {
  return (
    <>
      <Helmet>
        <title>SMTP Config | GAMA AirOps</title>
      </Helmet>
      <SmtpConfigView />
    </>
  );
}
