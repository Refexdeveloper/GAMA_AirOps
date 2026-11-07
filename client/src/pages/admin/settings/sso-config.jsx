import { Helmet } from 'react-helmet-async';

import { SsoConfigView } from 'src/sections/admin/settings';

export default function SsoConfigPage() {
  return (
    <>
      <Helmet>
        <title>SSO Config | GAMA AirOps</title>
      </Helmet>
      <SsoConfigView />
    </>
  );
}
