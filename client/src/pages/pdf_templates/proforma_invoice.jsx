/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  Stack,
  Table,
  styled,
  useTheme,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  tableCellClasses,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrencyWords } from 'src/utils/format-number';

import Logo from 'src/components/logo';

const authToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY';

// Styled components using Material UI's styled API
const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
  fontSize: '0.60rem',
  lineHeight: 1.3,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid black',
  padding: '3px',
  fontSize: '0.60rem',
  lineHeight: 1.3,
  // textAlign: 'right',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'inherit',
    color: 'inherit',
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)({
  height: '20px', // Adjust based on preference for row height
});

const formatDate = (isoString) => {
  const date = new Date(isoString);

  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  return formattedDate;
};

// const convertToTimeString = (totalMinutes) => {
//   // Separating Total minutes into hours and minutes.
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;

//   let timeString = '';
//   if (hours > 1) {
//     timeString += `${hours} hrs `;
//   } else if (hours > 0) {
//     timeString += `${hours} hr `;
//   }

//   if (minutes > 1) {
//     timeString += `${minutes} mins`;
//   } else if (minutes > 0) {
//     timeString += `${minutes} min`;
//   }

//   return timeString;
// };

const convertToTimeString = (totalMinutes) => {
  // Convert total minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format with zero-padding
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return timeString;
};

export default function ProformaInvoice() {
  const { invoiceId } = useParams();
  const theme = useTheme();
  const [invoice, setInvoice] = useState({
    id: 0,
    customer: {
      name: '',
      address: '',
      email: '',
      phone: '',
      company_name: '',
      gst_no: '',
    },
    aircraft: null,
    aircraft_reg_no: '',
    aircraft_model_name: '',
    aircraft_id: null,
    trip_cost: 0,
    sub_total: 0,
    discount: 0,
    st_after_discount: 0,
    gst: 0,
    grand_total: 0,
    hsn_sac: 0,
    charges: [],
    trips: [
      {
        duration: 0,
        start_at: '',
        departure_airport: { city: { city_name: '' } },
        arrival_airport: { city: { city_name: '' } },
        cost: 0,
      },
    ],
    created_at: null,
  });
  console.log(invoice);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/pdf_data/proforma_invoice/${invoiceId}`, {
          headers: { Authorization: authToken },
        })
        .then((res) => {
          setInvoice(res.data.results);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack justifyContent="center" alignItems="center">
      {invoice ? (
        <>
          {/* First Page  */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              px: '10mm',
              pt: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // border: '1px dotted',
              backgroundColor: '#ffffff',
            }}
          >
            <Stack
              width={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pb="5mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>

            <Box width={1} height="251.16mm" border="1px solid" sx={{ position: 'relative' }}>
              {/* Header Content  */}
              <Typography
                component="div"
                variant="subtitle2"
                textAlign="center"
                borderBottom="1px solid"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: '0.70rem', p: '2px' }}
              >
                PROFORMA INVOICE
              </Typography>
              <Stack width={1} direction="row">
                <Box width="100mm" height="60mm" borderRight="1px solid">
                  <Stack direction="column">
                    <Typography
                      component="div"
                      variant="body2"
                      height="30mm"
                      borderBottom="1px solid"
                      sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 0.5 }}
                    >
                      <b>
                        Company:
                        <br />
                        SPARZANA AVIATION PRIVATE LIMITED
                      </b>
                      <br />
                      313, 4th Floor, Refex Towers, <br />
                      Sterling Road Signal, Valluvar Kottam High Road,
                      <br />
                      Nungambakkam, Chennai - 34, TN, India.
                      <br />
                      CIN : U62100TN2019PTC128018 <br />
                      GST No.: 33ABBCS7395H1Z2
                    </Typography>
                    <Typography
                      component="div"
                      variant="body2"
                      height="30mm"
                      sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 0.5, pr: 20 }}
                    >
                      <b>Bill To:</b>
                      <br />
                      <b>
                        {invoice.customer.type === 'Individual'
                          ? invoice.customer.name
                          : invoice.customer.company_name}
                      </b>
                      <br />
                      {invoice.customer.address}
                      <br />
                      {invoice.customer.type === 'Individual'
                        ? `Phone : ${invoice.customer.phone}`
                        : `GST No.: ${invoice.customer.gst_no}`}
                      <br />
                    </Typography>
                  </Stack>
                </Box>
                <Box width="90mm">
                  <Stack direction="column">
                    <Box height="55.5mm">
                      <Stack direction="row" borderBottom="1px solid">
                        <Typography
                          component="div"
                          variant="body2"
                          width={1}
                          borderRight="1px solid"
                          sx={{ fontSize: '0.60rem' }}
                        >
                          &nbsp;<b>Invoice No:</b>&nbsp;
                          {`SAPL/PI-${String(invoice.id).padStart(4, '0')}`}
                        </Typography>
                        <Typography
                          component="div"
                          variant="body2"
                          width={1}
                          sx={{ fontSize: '0.60rem' }}
                        >
                          &nbsp;<b>Dated:</b>&nbsp;
                          {fDate(invoice.created_at, 'dd-MM-yyyy')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" borderBottom="1px solid">
                        <Typography
                          component="div"
                          variant="body2"
                          width={1}
                          borderRight="1px solid"
                          sx={{ fontSize: '0.60rem' }}
                        >
                          &nbsp;<b>Aircraft Regn:</b>&nbsp;
                          {invoice.aircraft?.reg_no ?? invoice.aircraft_reg_no ?? '—'}
                        </Typography>
                        <Typography
                          component="div"
                          variant="body2"
                          width={1}
                          sx={{ fontSize: '0.60rem' }}
                        >
                          &nbsp;<b>Aircraft Model: </b>&nbsp;
                          {invoice.aircraft?.model?.aircraft_model ??
                            invoice.aircraft_model_name ??
                            '—'}
                        </Typography>
                      </Stack>
                    </Box>
                    <Typography
                      component="div"
                      variant="body2"
                      borderTop="1px solid"
                      sx={{ fontSize: '0.60rem' }}
                    >
                      &nbsp;<b>Kind Attn: Mr/Mrs.</b> {invoice.customer.name}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Middle content  */}
              <TableContainer>
                <StyledTable aria-label="custom table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell sx={{ borderLeft: 'none', width: '5%' }}>
                        SL.No
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '65%' }}>Particulars</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Rate</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Unit / Time</StyledTableCell>
                      <StyledTableCell sx={{ borderRight: 'none', width: '10%' }}>
                        Amount
                        <br />
                        (INR)
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow sx={{ height: '20mm', verticalAlign: 'top' }}>
                      <StyledTableCell
                        sx={{
                          borderLeft: 'none',
                          borderBottom: 'none',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        1
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderBottom: 'none' }}>
                        Date / Sector / Timings
                        {invoice.trips.map((trip, index) => (
                          <Box key={index} sx={{ textAlign: 'center' }}>
                            {`${formatDate(trip.start_at)} / ${
                              trip.departure_airport.city.city_name
                            } - ${trip.arrival_airport.city.city_name}`}
                          </Box>
                        ))}
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>
                        <br />
                        {invoice.trips.map((trip, index) => (
                          <Box key={index}>
                            {trip.cost}
                            <br />
                          </Box>
                        ))}
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>
                        <br />
                        {invoice.trips.length} /{' '}
                        {convertToTimeString(
                          invoice.trips.reduce((total, trip) => total + trip.duration, 0)
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ borderRight: 'none', borderBottom: 'none', textAlign: 'right' }}
                      >
                        <br />
                        {invoice.trip_cost}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow sx={{ verticalAlign: 'top' }}>
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                      />
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }}>
                        <div>
                          {invoice.charges.map((charge, index) => {
                            if (charge.cost) {
                              return <Box key={index}>Add: {charge.title}</Box>;
                            }
                            return null;
                          })}
                          <br />
                          <b>(Subject to the availability of Aircraft and Airport Slot)</b>
                          <br />
                        </div>
                        <br />
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell
                        sx={{
                          borderTop: 'none',
                          borderBottom: 'none',
                          borderRight: 'none',
                          textAlign: 'right',
                        }}
                      >
                        {invoice.charges.map((charge, index) => {
                          if (charge.cost) {
                            return <Box key={index}>{charge.cost}</Box>;
                          }
                          return null;
                        })}
                        <br />
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                      />
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }}>
                        Add: SGST
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}
                      >
                        9%
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell
                        sx={{
                          borderTop: 'none',
                          borderBottom: 'none',
                          borderRight: 'none',
                          textAlign: 'right',
                        }}
                      >
                        {invoice.customer.gst_no?.trim().startsWith('33')
                          ? (invoice.sub_total * 0.09).toFixed(2)
                          : '-'}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                      />
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }}>
                        Add: CGST
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}
                      >
                        9%
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell
                        sx={{
                          borderTop: 'none',
                          borderBottom: 'none',
                          borderRight: 'none',
                          textAlign: 'right',
                        }}
                      >
                        {invoice.customer.gst_no?.trim().startsWith('33')
                          ? (invoice.sub_total * 0.09).toFixed(2)
                          : '-'}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ borderTop: 'none', borderLeft: 'none' }} />
                      <StyledTableCell sx={{ borderTop: 'none' }}>
                        Add: IGST
                        <br />
                        <br />
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none', textAlign: 'center' }}>
                        18%
                        <br />
                        <br />
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none' }} />
                      <StyledTableCell
                        sx={{ borderTop: 'none', borderRight: 'none', textAlign: 'right' }}
                      >
                        {invoice.customer.gst_no?.trim().startsWith('33') ? '-' : invoice.gst}
                        <br />
                        <br />
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        sx={{ borderLeft: 'none', borderBottom: 'none', fontWeight: 'bold' }}
                      />
                      <StyledTableCell
                        sx={{ borderBottom: 'none', fontWeight: 'bold', textAlign: 'right' }}
                      >
                        Total
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }} />

                      <StyledTableCell
                        sx={{ borderBottom: 'none', fontWeight: 'bold', textAlign: 'center' }}
                      >
                        {invoice.trips.length} /{' '}
                        {convertToTimeString(
                          invoice.trips.reduce((total, trip) => total + trip.duration, 0)
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          borderRight: 'none',
                          borderBottom: 'none',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        {(invoice.sub_total + invoice.gst).toFixed(2)}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        sx={{ borderLeft: 'none', borderTop: 'none', borderBottom: 'none' }}
                      />
                      <StyledTableCell
                        sx={{
                          borderTop: 'none',
                          borderBottom: 'none',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        Discount
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell sx={{ borderTop: 'none', borderBottom: 'none' }} />
                      <StyledTableCell
                        sx={{
                          borderRight: 'none',
                          borderTop: 'none',
                          borderBottom: 'none',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        {invoice.discount ? invoice.discount : '-'}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ borderLeft: 'none', borderTop: 'none' }} />
                      <StyledTableCell
                        sx={{ borderTop: 'none', fontWeight: 'bold', textAlign: 'right' }}
                      >
                        Round Off
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderTop: 'none' }} />
                      <StyledTableCell sx={{ borderTop: 'none' }} />
                      <StyledTableCell
                        sx={{
                          borderRight: 'none',
                          borderTop: 'none',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        -
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell sx={{ borderLeft: 'none' }} />
                      <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        Total Amount
                      </StyledTableCell>
                      <StyledTableCell />
                      <StyledTableCell />
                      <StyledTableCell
                        sx={{ borderRight: 'none', fontWeight: 'bold', textAlign: 'right' }}
                      >
                        {invoice.grand_total}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </StyledTable>
              </TableContainer>
              <Typography
                component="div"
                variant="body2"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: '0.60rem', p: '2px' }}
              >
                Amount Chargeable (in words) : {fCurrencyWords(invoice.grand_total)}
              </Typography>
              <TableContainer>
                <StyledTable aria-label="custom table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell rowSpan={2} sx={{ borderLeft: 'none', width: '15%' }}>
                        HSN/SAC
                      </StyledTableCell>
                      <StyledTableCell rowSpan={2} sx={{ width: '15%' }}>
                        Taxable Value
                      </StyledTableCell>
                      <StyledTableCell colSpan={2} sx={{ width: '10%' }}>
                        IGST
                      </StyledTableCell>
                      <StyledTableCell colSpan={2} sx={{ width: '10%' }}>
                        Central Tax
                      </StyledTableCell>
                      <StyledTableCell colSpan={2} sx={{ width: '10%' }}>
                        State Tax
                      </StyledTableCell>
                      <StyledTableCell rowSpan={2} sx={{ borderRight: 'none', width: '12%' }}>
                        Total Tax Amount
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      {/* <StyledTableCell style={{ width: '20%' }} /> */}
                      {/* <StyledTableCell style={{ width: '20%' }}>Particulars</StyledTableCell> */}
                      <StyledTableCell sx={{ width: '10%' }}>Rate</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Amount</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Rate</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Amount</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Rate</StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>Amount</StyledTableCell>
                      {/* <StyledTableCell style={{ width: '12%' }} /> */}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell sx={{ borderLeft: 'none', textAlign: 'center' }}>
                        {invoice.hsn_sac}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {invoice.sub_total}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'center' }}>18%</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {invoice.customer.gst_no?.trim().startsWith('33') ? '-' : invoice.gst}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'center' }}>9%</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {invoice.customer.gst_no?.trim().startsWith('33')
                          ? (invoice.sub_total * 0.09).toFixed(2)
                          : '-'}
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'center' }}>9%</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: 'right' }}>
                        {invoice.customer.gst_no?.trim().startsWith('33')
                          ? (invoice.sub_total * 0.09).toFixed(2)
                          : '-'}
                      </StyledTableCell>
                      <StyledTableCell sx={{ borderRight: 'none', textAlign: 'right' }}>
                        {invoice.gst}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        sx={{ borderLeft: 'none', fontWeight: 'bold', textAlign: 'right' }}
                      >
                        Total
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        {invoice.sub_total}
                      </StyledTableCell>
                      <StyledTableCell />
                      <StyledTableCell />
                      <StyledTableCell />
                      {/* <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        -
                      </StyledTableCell> */}
                      <StyledTableCell />
                      <StyledTableCell />
                      <StyledTableCell />
                      {/* <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                        -
                      </StyledTableCell> */}
                      <StyledTableCell
                        sx={{ borderRight: 'none', fontWeight: 'bold', textAlign: 'right' }}
                      >
                        {invoice.gst}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </StyledTable>
              </TableContainer>
              <Typography
                component="div"
                variant="body2"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: '0.60rem', p: '2px' }}
              >
                Tax Amount (in words) : {fCurrencyWords(invoice.gst)}
              </Typography>
              {/* Bottom Content  */}
              <Box width={1} sx={{ position: 'absolute', bottom: 0 }}>
                <Stack direction="row" spacing={5}>
                  <Box width={1} display="flex" alignItems="center">
                    <Typography
                      component="div"
                      variant="body2"
                      sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 0.5 }}
                    >
                      <b>Declaration :</b>
                      <br />
                      1. Payment 100% In Advance.
                      <br />
                      2. Refund 50% cancellation on or before 24 hrs of the ETD & 100% Cancellation
                      within 24 hrs of ETD.
                      <br />
                      3. The payment in favor of &quot;SPARZANA AVIATION PRIVATE LIMITED&quot;
                      Interest @ 24% shall be charged if payment is not received with in the agreed
                      due dates.
                      <br />
                      4. Minimum 2 hrs commitment to be charged per day.
                    </Typography>
                  </Box>
                  <Stack direction="column" spacing={2}>
                    <Typography
                      component="div"
                      variant="body2"
                      sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 0.5 }}
                    >
                      Company&apos;s Bank A/c. Details
                      <br />
                      Beneficiary Name: SPARZANA AVIATION PRIVATE LIMITED
                      <br />
                      Name of the Bank: Union Bank of India
                      <br />
                      Bank Account Number: 012221010000057
                      <br />
                      Bank Branch: Whites Road Branch, Chennai
                      <br />
                      IFSC Code: UBIN0901229
                      <br />
                    </Typography>
                    <Box width="75mm" borderTop="1px solid" borderLeft="1px solid">
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 0.5 }}
                      >
                        <b>
                          For SPARZANA AVIATION PRIVATE LIMITED
                          <br />
                          <Box
                            component="img"
                            src="/assets/signature/ashok.png"
                            sx={{ height: 50 }}
                          />
                          <br />
                          Authorised Signatory
                        </b>
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            <Typography
              component="div"
              variant="body2"
              textAlign="center"
              fontWeight={theme.typography.fontWeightBold}
              sx={{ fontSize: '0.60rem' }}
            >
              Registered Office: 313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam
              High Road, Nungambakkam, Chennai - 34, TN, India.
            </Typography>
          </Box>
          {/* Second Page  */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              px: '10mm',
              pt: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // border: '1px dotted',
              backgroundColor: '#ffffff',
            }}
          >
            <Stack
              width={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pb="5mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>
            <Box width={1} height="251.16mm" border="1px solid">
              <Typography
                component="div"
                variant="subtitle2"
                textAlign="center"
                borderBottom="1px solid"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: '0.70rem', p: '2px' }}
              >
                TERMS & CONDITIONS
              </Typography>
              <Typography
                component="div"
                variant="body2"
                sx={{ fontSize: '0.60rem', lineHeight: 1.4, pl: 3 }}
              >
                <br /> <br />
                <b>1. Flight Details : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Flight timings and quotes are subject to change due to
                weather, wind, fog, visibility, and flight safety conditions.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Any extra flying due to diversions will be billed in the
                final invoice.
                <br />
                <br />
                <b>2. Confirmation and Payment : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Confirmation of date and time is subject to approval from
                authorities.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;100% payment is required as confirmation charges.-Names of
                passengers and their IDs/passport copies must be provided after confirmation.
                <br />
                <br />
                <b>3. Onboard Services :</b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Non-veg food, smoking, and alcohol consumption are not
                permitted.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;One baggage (15 kgs, 22&quot; size) and one small handbag
                are allowed per passenger.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Complimentary bottled water, juices, biscuits, and dry
                snacks will be provided.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Additional catering (vegetarian food) can be requested in
                advance at an extra charge.
                <br />
                <br />
                <b>4. Crew and Aircraft : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Crew accommodation, food, and transportation charges (Rs.
                75,000/-) will be applied for halts over 3 hours.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Watch hour extension charges will be applicable.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Block time is calculated from engine start to shutdown.
                <br />
                <br />
                <b>5. Payment Terms : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;25% advance payment to block the aircraft.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;100% payment (confirmation charges) 7 days prior to flying
                commitment.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Final billing will be based on actual flight logs or quote,
                whichever is higher.
                <br />
                <br />
                <b>6. Cancellation Charges : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;50% of total estimated charter cost if cancelled after
                aircraft blocking.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;75% if cancelled within 48 hours of scheduled departure.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;100% if cancelled within 36 hours or in case of no show.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Rs. 50,000/-flight preparation charges if cancelled due to
                force majeure.
                <br />
                <br />
                <b>7. Quotation and Invoice : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Quotation/proforma invoice is valid for 7 days.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Final invoice will include changes in flying hours, day and
                night parking, and other actuals.
                <br />
                <br />
                <b>8. Additional Terms :</b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Settlement of final invoice differences must be made within
                2 working days.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Foreign nationals traveling to defense airfields must
                provide passport details and confirmed timings at least 7 working days prior.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Diversions due to bad weather or other reasons will be
                borne by the client.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Every flight will operate as per DGCA India guidelines.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Passengers must ensure correctness of travel documents and
                comply with Ministry of Civil Aviation regulations.
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;Customer indemnifies SAPL against any claims, liabilities,
                and unforeseen incidents.
                <br />
                <br />
                <b>9. Force Majeure : </b>
                <br />
                &nbsp;&nbsp;&nbsp;-&nbsp;SAPL will not be held responsible for non-operation of a
                confirmed charter due to reasons beyond its control.
                <br />
                <br />
                <br />
                <b>
                  Acceptance,
                  <br /> I/We have read, understood, and agree to the above terms and conditions.
                </b>
                <br />
                <br />
                <br />
                <b>Date : _______________________</b>
                <br />
                <br />
                <b>Authorized Signatory: _______________________</b>
                <br />
                <br />
                <b>Designation : _______________________</b>
                <br />
                <br />
                <b>Company Seal: _______________________</b>
                {/* <b>Date : </b>
                <br />
                <br />
                <b>Designation : </b>
                <br />
                <br /> */}
              </Typography>
              {/* <Stack direction="row" sx={{ mt: 15, px: 15, justifyContent: 'space-between' }}>
                <Typography
                  component="div"
                  variant="body2"
                  fontWeight={theme.typography.fontWeightBold}
                  textAlign="center"
                  sx={{ fontSize: '0.60rem', lineHeight: 1.4 }}
                >
                  Company Seal
                </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  textAlign="center"
                  fontWeight={theme.typography.fontWeightBold}
                  sx={{ fontSize: '0.60rem', lineHeight: 1.4 }}
                >
                  Authorized Signatory
                </Typography>
              </Stack> */}
            </Box>
            <Typography
              component="div"
              variant="body2"
              textAlign="center"
              fontWeight={theme.typography.fontWeightBold}
              sx={{ fontSize: '0.60rem' }}
            >
              Registered Office: 313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam
              High Road, Nungambakkam, Chennai - 34, TN, India.
            </Typography>
          </Box>
        </>
      ) : (
        <Box component="p">Failed to load pdf..!</Box>
      )}
    </Stack>
  );
}
