/* eslint-disable import/no-unresolved */
import Iconify from 'src/components/iconify';
// import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

// const navConfig = [
//   {
//     title: 'dashboard',
//     path: '/',
//     icon: icon('ic_analytics'),
//   },
//   {
//     title: 'user',
//     path: '/user',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'product',
//     path: '/products',
//     icon: icon('ic_cart'),
//   },
//   {
//     title: 'blog',
//     path: '/blog',
//     icon: icon('ic_blog'),
//   },
//   {
//     title: 'login',
//     path: '/login',
//     icon: icon('ic_lock'),
//   },
//   {
//     title: 'Not found',
//     path: '/404',
//     icon: icon('ic_disabled'),
//   },
// ];
const appNav = [
  {
    title: 'overview',
    content: [
      // Overview
      {
        title: 'dashboard',
        path: '/dashboard',
        icon: <Iconify icon="solar:widget-5-bold-duotone" width={24} />,
      },
      
      // {
      //   title: 'calendar',
      //   path: '/calendar',
      //   icon: <Iconify icon="solar:calendar-bold-duotone" width={24} />,
      // },
      // {
      //   title: 'sales management',
      //   path: '/sales_management',
      //   icon: <Iconify icon="solar:tag-bold-duotone" width={24} />,
      //   children: [
      //     // {
      //     //   title: 'customer contacts',
      //     //   path: '/app/sales_management/customer_contacts',
      //     //   icon: icon('ic_user'),
      //     // },
      //     {
      //       title: 'quotation',
      //       path: '/sales_management/quotation',
      //       icon: <Iconify icon="solar:file-text-bold-duotone" width={24} />, //  icon('ad_file-text-filled')
      //     },
      //     // {
      //     //   title: 'lead',
      //     //   path: '/app/sales_management/lead',
      //     //   icon: icon('ic_cart'),
      //     // },
      //     {
      //       title: 'proforma invoice',
      //       path: '/sales_management/proforma_invoice',
      //       icon: <Iconify icon="solar:bill-check-bold-duotone" width={24} />,
      //     },
      //     // {
      //     //   title: 'tax invoice',
      //     //   path: '/app/sales_management/tax_invoice',
      //     //   icon: icon('ic_cart'),
      //     // }
      //   ],
      // },
      // {
      //   title: "trip management",
      //   path: "/app/trip_management",
      //   icon: icon("ic_flight"),
      //   children: [
      //     {
      //       title: "crew rostering",
      //       path: "/app/trip_management/crew_rostering",
      //       icon: icon("ic_user"),
      //     },
      //     {
      //       title: "calendar",
      //       path: "/app/trip_management/calendar",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "notam clearance",
      //       path: "/app/trip_management/notam_clearance",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "aircraft availability",
      //       path: "/app/trip_management/aircraft_availability",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "FDTL",
      //       path: "/app/trip_management/fdtl",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "watch dog",
      //       path: "/app/trip_management/watch_dog",
      //       icon: icon("ic_cart"),
      //     },
      //   ],
      // },
      // {
      //   title: "maintenance",
      //   path: "/app/maintenance",
      //   icon: icon("ic_build"),
      //   children: [
      //     {
      //       title: "CAMO",
      //       path: "/app/maintenance/camo",
      //       icon: icon("ic_user"),
      //     },
      //     {
      //       title: "purchase order",
      //       path: "/app/maintenance/purchase_order",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "work order",
      //       path: "/app/maintenance/work_order",
      //       icon: icon("ic_cart"),
      //     },
      //     {
      //       title: "spare parts",
      //       path: "/app/maintenance/spare_parts",
      //       icon: icon("ic_cart"),
      //     },
      //   ],
      // },
      // {
      //   title: "user",
      //   path: "/dashboard/user",
      //   icon: icon("ic_user"),
      // },
      // {
      //   title: "product",
      //   path: "/dashboard/products",
      //   icon: icon("ic_cart"),
      // },
      // {
      //   title: "blog",
      //   path: "/dashboard/blog",
      //   icon: icon("ic_blog"),
      // },
      // {
      //   title: "login",
      //   path: "/login",
      //   icon: icon("ic_lock"),
      // },
      // {
      //   title: "Not found",
      //   path: "/404",
      //   icon: icon("ic_disabled"),
      // },
    ],
  },
  {
    title: 'sales management',
    content: [
      // Overview
      {
        title: 'customers',
        path: '/sales_management/customers',
        icon: <Iconify icon="solar:user-heart-bold-duotone" width={24} />,
      },
      {
        title: 'leads',
        path: '/sales_management/leads',
        icon: <Iconify icon="solar:graph-new-up-bold-duotone" width={24} />,
      },
      {
        title: 'quotation',
        path: '/sales_management/quotation',
        icon: <Iconify icon="solar:file-text-bold-duotone" width={24} />,
      },
      {
        title: 'NSOP Quotation',
        path: '/sales_management/nsop_quotation',
        icon: <Iconify icon="solar:file-bold-duotone" width={24} />,
      },
      {
        title: 'proforma invoice',
        path: '/sales_management/proforma_invoice',
        icon: <Iconify icon="solar:bill-check-bold-duotone" width={24} />,
      },
      {
        title: 'flight brief sheet',
        path: '/sales_management/flight_brief_sheet',
        icon: <Iconify icon="solar:document-text-bold-duotone" width={24} />,
      },
    ],
  },
  {
    title: 'trip management',
    content: [
      {
        title: 'masters',
        path: '/trip_management/masters',
        icon: <Iconify icon="solar:database-bold-duotone" width={24} />,
        children: [
          {
            title: 'aircraft model',
            path: '/trip_management/masters/aircraft_models',
            icon: <Iconify icon="mdi:shield-aeroplane" width={24} />,
          },
          {
            title: 'aircraft',
            path: '/trip_management/masters/aircrafts',
            icon: <Iconify icon="entypo:aircraft" width={24} />,
          },
          {
            title: 'country',
            path: '/trip_management/masters/country',
            icon: <Iconify icon="subway:world-1" />,
          },
          {
            title: 'city',
            path: '/trip_management/masters/city',
            icon: <Iconify icon="solar:city-bold-duotone" width={24} />,
          },
          {
            title: 'airport',
            path: '/trip_management/masters/airport',
            icon: <Iconify icon="material-symbols:multiple-airports-rounded" width={24} />,
          },
          // {
          //   title: 'duty status detail',
          //   path: '/trip_management/masters/duty_status_detail',
          //   icon: <Iconify icon="solar:plate-bold-duotone" width={24} />,
          // },
          // {
          //   title: 'crew',
          //   path: '/trip_management/masters/crew',
          //   icon: <Iconify icon="solar:user-plus-bold-duotone" width={24} />,
          // },
          // {
          //   title: 'group',
          //   path: '/trip_management/masters/group',
          //   icon: <Iconify icon="solar:users-group-two-rounded-bold-duotone" width={24} />,
          // },
          // {
          //   title: 'delay category',
          //   path: '/trip_management/masters/delay_category',
          //   icon: <Iconify icon="solar:alarm-sleep-bold-duotone" width={24} />,
          // },
          // {
          //   title: 'delay explanation',
          //   path: '/trip_management/masters/delay_explanation',
          //   icon: <Iconify icon="solar:info-circle-bold-duotone" width={24} />,
          // },
          // {
          //   title: 'Crew Training/Document Master',
          //   path: '/trip_management/masters/crew_training/document_master',
          //   icon: <Iconify icon="fluent:chart-person-20-filled" width={24} />,
          // },
          // {
          //   title: 'hotel',
          //   path: '/trip_management/masters/hotel',
          //   icon: <Iconify icon="solar:sleeping-bold-duotone" width={24} />,
          // },
        ],
      },
      // {
      //   title: 'entry',
      //   path: '/trip_management/entry',
      //   icon: <Iconify icon="solar:letter-bold-duotone" width={24} />,
      //   children: [
      //     {
      //       title: 'crew roaster',
      //       path: '/trip_management/entry/crew_roaster',
      //       icon: <Iconify icon="mdi:account-pilot" width={24} />,
      //     },
      //     {
      //       title: 'flight scheduler',
      //       path: '/trip_management/entry/flight_scheduler',
      //       icon: <Iconify icon="solar:stopwatch-bold-duotone" width={24} />,
      //     },
      //     {
      //       title: 'crew allocation',
      //       path: '/trip_management/entry/crew_allocation',
      //       icon: <Iconify icon="solar:user-plus-bold-duotone" width={24} />,
      //     },
      //     {
      //       title: 'Crew Training/Document',
      //       path: '/trip_management/entry/crew_training/document',
      //       icon: <Iconify icon="fluent:chart-person-20-filled" width={24} />,
      //     },
      //     {
      //       title: 'Message Board',
      //       path: '/trip_management/entry/message_board',
      //       icon: <Iconify icon="solar:chat-round-line-bold-duotone" width={24} />,
      //     },
      //   ],
      // },
      // {
      //   title: 'reports',
      //   path: '/app/reports',
      //   icon: <Iconify icon="solar:chart-bold-duotone" width={24} />,
      //   children: [
      //     {
      //       title: 'Crew Training Document Report',
      //       path: '/app/reports/crew_training_document_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew Monthy Report',
      //       path: '/app/reports/crew_monthy_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew FD/FT Status List Report',
      //       path: '/app/reports/crew_fd/ft_status_list_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew duty status report',
      //       path: '/app/reports/crew_duty_status_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Graphical Report',
      //       path: '/app/reports/graphical_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew FDT Status Report',
      //       path: '/app/reports/crew_fdt_status_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Monthy Schedule Report',
      //       path: '/app/reports/monthy_schedule_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew Schedule Advisory Report',
      //       path: '/app/reports/crew_schedule_advisory_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Delay Breakdown report',
      //       path: '/app/reports/delay_breakdown_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Station Report ',
      //       path: '/app/reports/station_report ',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Violation Report',
      //       path: '/app/reports/violation_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Daily Occ Report',
      //       path: '/app/reports/daily_occ_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Crew Duty Log report',
      //       path: '/app/reports/crew_duty_log_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Flight Detail Report',
      //       path: '/app/reports/flight_detail_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Recency Report',
      //       path: '/app/reports/recency_report',
      //       icon: icon('ic_sell'),
      //     },
      //     {
      //       title: 'Aircraft Monthly Flying Report',
      //       path: '/app/reports/aircraft_monthly_flying_report',
      //       icon: icon('ic_sell'),
      //     },
      //   ],
      // },
      // {
      //   title: 'utility',
      //   path: '/app/utility',
      //   icon: <Iconify icon="solar:monitor-bold-duotone" width={24} />,
      //   children: [
      //     {
      //       title: 'Import Crew Roaster',
      //       path: '/app/utility/import_crew_roaster',
      //       icon: <Iconify />,
      //     },
      //     {
      //       title: 'Emil/SMS Configuration',
      //       path: '/app/utility/emil/sms_configuration',
      //       icon: <Iconify />,
      //     },
      //     {
      //       title: 'Import Allocation',
      //       path: '/app/utility/import_allocation',
      //       icon: <Iconify />,
      //     },
      //   ],
      // },
    ],
  },
];

export default appNav;
