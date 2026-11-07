import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import LogoutPage from 'src/pages/logout';
import { useAuth } from 'src/context/AuthContext';
import DashboardLayout from 'src/layouts/dashboard';



export const IndexPage = lazy(() => import('src/pages/app'));
export const CalendarPage = lazy(() => import('src/pages/calendar'));
export const UserListPage = lazy(() => import('src/pages/admin/user/user-list'));
export const UserDetailsPage = lazy(() => import('src/pages/admin/user/user-details'));


export const UserNewPage = lazy(() => import('src/pages/admin/user/user-new'));
export const UserEditPage = lazy(() => import('src/pages/admin/user/user-edit'));
export const SmtpConfigPage = lazy(() => import('src/pages/admin/settings/smtp-config'));
export const SsoConfigPage = lazy(() => import('src/pages/admin/settings/sso-config'));
export const SsoCallbackPage = lazy(() => import('src/pages/sso-callback'));
export const CustomersListPage = lazy(() =>
  import('src/pages/sales_management/customers/cutomers-list')
);
export const CustomersNewPage = lazy(() =>
  import('src/pages/sales_management/customers/customers-new')
);
export const CustomersEditPage = lazy(() =>
  import('src/pages/sales_management/customers/customers-edit')
);
export const CustomersDetailsPage = lazy(() =>
  import('src/pages/sales_management/customers/customers-details')
);
export const LeadsListPage = lazy(() => import('src/pages/sales_management/leads/leads-list'));
export const LeadsNewPage = lazy(() => import('src/pages/sales_management/leads/leads-new'));
export const LeadsEditPage = lazy(() => import('src/pages/sales_management/leads/leads-edit'));
export const LeadsDetailsPage = lazy(() =>
  import('src/pages/sales_management/leads/leads-details')
);
export const QuotationListPage = lazy(() =>
  import('src/pages/sales_management/quotation/quotation-list')
);
export const QuotationNewPage = lazy(() =>
  import('src/pages/sales_management/quotation/quotation-new')
);
// export const QuotationDetailsPage = lazy(() =>
//   import('src/pages/sales_management/quotation/quotation-details')
// );
export const QuotationEditPage = lazy(() =>
  import('src/pages/sales_management/quotation/quotation-edit')
);
export const NSOPQuotationNew = lazy(() =>
  import('src/pages/sales_management/nsop_quotation/nsop-quotation-new')
);
export const NSOPQuotationEdit = lazy(() =>
  import('src/pages/sales_management/nsop_quotation/nsop-quotation-edit')
);
export const NSOPQuotationList = lazy(() =>
  import('src/pages/sales_management/nsop_quotation/nsop-quotation-list')
);
export const PIListPage = lazy(() => import('src/pages/sales_management/proforma_invoice/pi-list'));
export const PINewPage = lazy(() => import('src/pages/sales_management/proforma_invoice/pi-new'));
export const PIEditPage = lazy(() => import('src/pages/sales_management/proforma_invoice/pi-edit'));
export const PIConvertPage = lazy(() =>
  import('src/pages/sales_management/proforma_invoice/pi-convert')
);
export const SheetListPage = lazy(() =>
  import('src/pages/sales_management/flight_brief_sheet/sheet-list')
);
export const SheetNewPage = lazy(() =>
  import('src/pages/sales_management/flight_brief_sheet/sheet-new')
);
export const SheetEditPage = lazy(() =>
  import('src/pages/sales_management/flight_brief_sheet/sheet-edit')
);
export const AircraftModelListPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft_model/model-list')
);
export const AircraftModelNewPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft_model/model-new')
);
export const AircraftModelDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft_model/model-details')
);
export const AircraftModelEditPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft_model/model-edit')
);
export const AircraftListPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft/aircraft-list')
);
export const AircraftNewPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft/aircraft-new')
);
export const AircraftDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft/aircraft-details')
);
export const AircraftEditPage = lazy(() =>
  import('src/pages/trip_management/masters/aircraft/aircraft-edit')
);
export const AirportListPage = lazy(() =>
  import('src/pages/trip_management/masters/airport/airport-list')
);
export const AirportNewPage = lazy(() =>
  import('src/pages/trip_management/masters/airport/airport-new')
);
export const AirportDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/airport/airport-details')
);
export const AirportEditPage = lazy(() =>
  import('src/pages/trip_management/masters/airport/airport-edit')
);
export const CrewNewPage = lazy(() => import('src/pages/trip_management/masters/crew/crew-new'));
export const CrewListPage = lazy(() => import('src/pages/trip_management/masters/crew/crew-list'));
export const CrewDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/crew/crew-details')
);
export const CrewEditPage = lazy(() => import('src/pages/trip_management/masters/crew/crew-edit'));
export const QuotationPDF = lazy(() => import('src/pages/pdf_templates/quotation'));
export const NSOPQuotationPDF = lazy(() => import('src/pages/pdf_templates/nsop_quotation'));
export const ProformaInvoicePDF = lazy(() => import('src/pages/pdf_templates/proforma_invoice'));
export const BriefSheetPDF = lazy(() => import('src/pages/pdf_templates/brief_sheet'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const PrivacyPolicyPage = lazy(() => import('src/pages/privacy-policy'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));



// Country
export const CountryListPage = lazy(() =>
  import('src/pages/trip_management/masters/country/country-list')
);
export const CountryNewPage = lazy(() =>
  import('src/pages/trip_management/masters/country/country-new')
);
export const CountryDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/country/country-details'))

export const CountryEditPage = lazy(() =>
  import('src/pages/trip_management/masters/country/country-edit'))

// City
export const CityListPage = lazy(() =>
  import('src/pages/trip_management/masters/city/city-list')
);
export const CityNewPage = lazy(() =>
  import('src/pages/trip_management/masters/city/city-new')
);
export const CityDetailsPage = lazy(() =>
  import('src/pages/trip_management/masters/city/city-details'))

export const CityEditPage = lazy(() =>
  import('src/pages/trip_management/masters/city/city-edit'))



// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        // bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.info' },
      }}
    />
  </Box>
);

export default function Router() {
  const { isAuthenticated, user } = useAuth();
  // console.log(user);
  const PrivateRoute = ({ element, accessType, ...rest }) => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Check if the user type matches the required access type
    if (accessType && user && user.role !== accessType) {
      return <Navigate to="/404" />;
    }

    // Render the protected route
    return element;
  };

  PrivateRoute.propTypes = {
    element: PropTypes.element,
    accessType: PropTypes.string,
  };

  const routes = useRoutes([
    {
      path: '/',
      element: (
        <PrivateRoute
          element={
            <DashboardLayout>
              <Suspense fallback={renderFallback}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          }
        />
      ),
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'calendar', element: <CalendarPage /> },
        {
          path: 'sales_management',
          children: [
            { element: <Navigate to="/sales_management/customers" />, index: true },
            {
              path: 'customers',
              children: [
                { element: <Navigate to="/sales_management/customers/list" />, index: true },
                { path: 'list', element: <CustomersListPage /> },
                { path: ':customerId', element: <CustomersDetailsPage /> },
                { path: ':customerId/edit', element: <CustomersEditPage /> },
                { path: 'new', element: <CustomersNewPage /> },
              ],
            },
            {
              path: 'leads',
              children: [
                { element: <Navigate to="/sales_management/leads/list" />, index: true },
                { path: 'list', element: <LeadsListPage /> },
                { path: ':leadId', element: <LeadsDetailsPage /> },
                { path: ':leadId/edit', element: <LeadsEditPage /> },
                { path: 'new', element: <LeadsNewPage /> },
              ],
            },
            {
              path: 'quotation',
              children: [
                { element: <Navigate to="/sales_management/quotation/list" />, index: true },
                { path: 'list', element: <QuotationListPage /> },
                { path: ':quoteId', element: <QuotationPDF /> },
                { path: ':quoteId/edit', element: <QuotationEditPage /> },
                { path: 'new', element: <QuotationNewPage /> },
              ],
            },
            {
              path: 'nsop_quotation',
              children: [
                { element: <Navigate to="/sales_management/nsop_quotation/list" />, index: true },
                { path: 'list', element: <NSOPQuotationList /> },
                { path: ':quoteId', element: <NSOPQuotationPDF /> },
                { path: ':quoteId/edit', element: <NSOPQuotationEdit /> },
                { path: 'new', element: <NSOPQuotationNew /> },
              ],
            },
            {
              path: 'proforma_invoice',
              children: [
                { element: <Navigate to="/sales_management/proforma_invoice/list" />, index: true },
                { path: 'list', element: <PIListPage /> },
                { path: ':invoiceId', element: <ProformaInvoicePDF /> },
                { path: ':invoiceId/edit', element: <PIEditPage /> },
                { path: 'new', element: <PINewPage /> },
                { path: ':quoteId/convert', element: <PIConvertPage /> },
              ],
            },
            {
              path: 'flight_brief_sheet',
              children: [
                {
                  element: <Navigate to="/sales_management/flight_brief_sheet/list" />,
                  index: true,
                },
                { path: 'list', element: <SheetListPage /> },
                { path: ':sheetId', element: <BriefSheetPDF /> },
                { path: ':sheetId/edit', element: <SheetEditPage /> },
                { path: 'new', element: <SheetNewPage /> },
              ],
            },
          ],
        },
        {
          path: 'trip_management',
          children: [
            { element: <Navigate to="/trip_management/masters" />, index: true },
            {
              path: 'masters',
              children: [
                {
                  element: <Navigate to="/trip_management/masters/aircraft_models" />,
                  index: true,
                },
                {
                  path: 'aircraft_models',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/aircraft_models/list" />,
                      index: true,
                    },
                    { path: 'list', element: <AircraftModelListPage /> },
                    { path: ':modelId', element: <AircraftModelDetailsPage /> },
                    { path: ':modelId/edit', element: <AircraftModelEditPage /> },
                    { path: 'new', element: <AircraftModelNewPage /> },
                  ],
                },
                {
                  path: 'aircrafts',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/aircrafts/list" />,
                      index: true,
                    },
                    { path: 'list', element: <AircraftListPage /> },
                    { path: ':aircraftId', element: <AircraftDetailsPage /> },
                    { path: ':aircraftId/edit', element: <AircraftEditPage /> },
                    { path: 'new', element: <AircraftNewPage /> },
                  ],
                },
                {
                  path: 'airport',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/airport/list" />,
                      index: true,
                    },
                    { path: 'list', element: <AirportListPage /> },
                    { path: ':airportId', element: <AirportDetailsPage /> },
                    { path: ':airportId/edit', element: <AirportEditPage /> },
                    { path: 'new', element: <AirportNewPage /> },
                  ],
                },
                {
                  path: 'crew',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/crew/list" />,
                      index: true,
                    },
                    { path: 'list', element: <CrewListPage /> },
                    { path: ':airportId', element: <CrewDetailsPage /> },
                    { path: ':airportId/edit', element: <CrewEditPage /> },
                    { path: 'new', element: <CrewNewPage /> },
                  ],
                },
                   {
                  path: 'country',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/country/list" />,
                      index: true,
                    },
                    { path: 'list', element: <CountryListPage /> },
                    { path: ':countryId', element: <CountryDetailsPage /> },
                    { path: ':countryId/edit', element: <CountryEditPage /> },
                    { path: 'new', element: <CountryNewPage /> },
                  ],
                },
                   {
                  path: 'city',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/city/list" />,
                      index: true,
                    },
                    { path: 'list', element: <CityListPage /> },
                    { path: ':cityId', element: <CityDetailsPage /> },
                    { path: ':cityId/edit', element: <CityEditPage /> },
                    { path: 'new', element: <CityNewPage /> },
                  ],
                },
                {
                  path: 'crew',
                  children: [
                    {
                      element: <Navigate to="/trip_management/masters/crew/list" />,
                      index: true,
                    },
                    { path: 'list', element: <CrewListPage /> },
                    { path: ':airportId', element: <CrewDetailsPage /> },
                    { path: ':airportId/edit', element: <CrewEditPage /> },
                    { path: 'new', element: <CrewNewPage /> },
                  ],
                },
              ],
            },
            {
              path: 'entry',
              children: [
                { element: <Navigate to="/trip_management/entry/crew_roaster" />, index: true },
                {
                  path: 'crew_roaster',
                  children: [
                    {
                      element: <Navigate to="/trip_management/entry/crew_roaster/list" />,
                      index: true,
                    },
                    { path: 'list', element: <IndexPage /> },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: 'admin',
      element: (
        <PrivateRoute
          accessType="SuperAdmin"
          element={
            <DashboardLayout layout="admin">
              <Suspense fallback={renderFallback}>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          }
        />
      ),
      children: [
        { element: <Navigate to="/admin/user" />, index: true },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/admin/user/list" />, index: true },
            { path: 'list', element: <UserListPage /> },
            { path: ':userId', element: <UserDetailsPage /> },
            { path: ':userId/edit', element: <UserEditPage /> },
            { path: 'new', element: <UserNewPage /> },
          ],
        },
        {
          path: 'settings',
          children: [
            { element: <Navigate to="/admin/settings/smtp" />, index: true },
            { path: 'smtp', element: <SmtpConfigPage /> },
            { path: 'sso', element: <SsoConfigPage /> },
          ],
        },
      ],
    },
    {
      path: 'pdf',
      children: [
        { element: <Navigate to="/pdf/quotation" />, index: true },
        { path: 'quotation/:quoteId', element: <QuotationPDF /> },
        { path: 'nsop_quotation/:quoteId', element: <NSOPQuotationPDF /> },
        { path: 'proforma_invoice/:invoiceId', element: <ProformaInvoicePDF /> },
        { path: 'brief_sheet/:sheetId', element: <BriefSheetPDF /> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />,
    },
    {
      path: 'sso/callback',
      element: <SsoCallbackPage />,
    },
    {
      path: 'logout',
      element: isAuthenticated ? <LogoutPage /> : <Page404 />,
    },
    {
      path: 'forgot_password',
      element: <ForgotPasswordPage />,
    },
    {
      path: 'reset_password/:token',
      element: <ResetPasswordPage />,
    },
    {
      path: 'privacy_policy',
      element: <PrivacyPolicyPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
