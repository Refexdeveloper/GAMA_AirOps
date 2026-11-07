import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const SETTINGS_SUBNAV = [
  { title: 'SMTP Config', path: '/admin/settings/smtp' },
  { title: 'SSO Config', path: '/admin/settings/sso' },
];

const adminNav = [
  {
    title: 'administration',
    content: [
      {
        title: 'User',
        path: '/admin/user',
        icon: icon('ic_user'),
      },
      {
        title: 'Settings',
        path: '/admin/settings',
        icon: <Iconify icon="solar:settings-bold-duotone" width={24} />,
        children: [
          {
            title: 'SMTP Config',
            path: '/admin/settings/smtp',
            icon: <Iconify icon="solar:letter-bold-duotone" width={22} />,
          },
          {
            title: 'SSO Config',
            path: '/admin/settings/sso',
            icon: <Iconify icon="solar:shield-keyhole-bold-duotone" width={22} />,
          },
        ],
      },
    ],
  },
];

export default adminNav;
