/* eslint-disable import/no-unresolved */
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  Link,
  Chip,
  alpha,
  Stack,
  Table,
  Paper,
  styled,
  Divider,
  useTheme,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Typography,
  TableContainer,
  tableCellClasses,
} from '@mui/material';

import { bgBlur, bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

const authToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY';

const formatDate = (date) => {
  const optionsWeekday = { weekday: 'short' };
  const weekday = new Date(date).toLocaleDateString('en-GB', optionsWeekday);

  const day = new Date(date).getDate();
  const month = new Date(date).toLocaleString('en-GB', { month: 'short' });
  const year = new Date(date).getFullYear();

  const formattedDate = `${day} ${month}, ${year}`;

  return { weekday, formattedDate };
};

const formatePhone = (phone) => {
  const countryCode = '+91';
  const part1 = phone.slice(0, 5);
  const part2 = phone.slice(5);
  return `${countryCode} ${part1} ${part2}`;
};

const DateDisplay = ({ date }) => {
  const { weekday, formattedDate } = formatDate(date);
  return (
    <Box p={1}>
      <Typography variant="body2">{weekday}</Typography>
      <Typography variant="body2">{formattedDate}</Typography>
    </Box>
  );
};

DateDisplay.propTypes = {
  date: PropTypes.string,
};

const PhoneDisplay = ({ phone }) => {
  const formattedPhoneNumber = formatePhone(phone);
  return (
    <Link href={`tel:${phone}`}>
      <Typography component="span" variant="body2">
        {formattedPhoneNumber}
      </Typography>
    </Link>
  );
};

PhoneDisplay.propTypes = {
  phone: PropTypes.string,
};

const convertToTimeString2 = (totalMinutes) => {
  // Separating Total minutes into hours and minutes.
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let timeString = '';
  if (hours > 1) {
    timeString += `${hours} hrs `;
  } else if (hours > 0) {
    timeString += `${hours} hr `;
  }

  if (minutes > 1) {
    timeString += `${minutes} mins`;
  } else if (minutes > 0) {
    timeString += `${minutes} min`;
  }

  return timeString;
};
const convertToTimeString = (totalMinutes) => {
  // Convert total minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format with zero-padding
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return timeString;
};

const formateCurrency = (value = 0) =>
  value
    ? value.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : '₹0';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#ee6a31',
    color: theme.palette.common.white,
    fontSize: 11,
    fontWeight: theme.typography.fontWeightBold,
    border: '1px solid black',
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 10,
    lineHeight: 1.1,
    border: '1px solid black',
    padding: 4,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
    backgroundColor: '#00000018',
  },
  '& td, & th': {
    border: '1px solid black',
  },
  // hide last border
  //   '&:last-child td, &:last-child th': {
  //     border: 0,
  //   },
}));

export default function Quotation() {
  const { quoteId } = useParams();
  const theme = useTheme();
  const [quotation, setQuotation] = useState({
    id: 0,
    aircraft: {
      model: {
        aircraft_model: '',
        images: {
          aircraft_image_1: '',
          interior_image_1: '',
        },
        base_airport: {
          city: {
            city_name: '',
          },
        },
      },
    },
    charges: [],
    trips: [],
    is_simple: false,
    created_at: null,
  });
  console.log(quotation);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/pdf_data/quotation/${quoteId}`, { headers: { Authorization: authToken } })
        .then((res) => setQuotation(res.data.results));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB'); // 24-hour format
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    return `${weekday} ${day} ${month} ${year}`;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {quotation && quotation.is_simple === 'OnePage' ? (
        <Box bgcolor={theme.palette.background.paper}>
          {/* First Page */}
          <Box
            sx={{
              width: '210mm',
              height: '100%',
              // py: '5mm',
              // px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // ...bgGradient({
              //   color: alpha(theme.palette.background.paper, 0),
              //   imgUrl: `/uploads/nsop_quotation/images/${quotation.aircraft_image}`,
              // }),
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '30mm',
                backgroundImage: `url(/uploads/aircrafts/${quotation.aircraft.model.images.aircraft_image_1})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
            {/* <Stack
                    height="26.50mm"
                    width="100%"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px="10mm"
                  >
                    <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
                    <Logo sx={{ width: 90, height: 75 }} />
                  </Stack> */}
            <Stack
              // height="10mm"
              width="100%"
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid #00f5e9"
              px={4}
            >
              <Stack
                width="105mm"
                direction="row"
                justifyContent="left"
                alignItems="center"
                py={1}
                gap={1}
                borderRight="1px solid #a7b0b0"
              >
                <Logo sx={{ width: 60, height: 50 }} />
                <Typography variant="h6">
                  <b>SPARZANA AVIATION</b>
                </Typography>
              </Stack>
              <Box width="105mm" pl={3} py={1}>
                <Typography variant="h6" color="#00c9bf">
                  <b>QUOTE {quotation.id}</b>
                  {/* {`SAPL/NQ-${String(quotation.id).padStart(4, '0')}`} */}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ borderBottom: '1px solid #00f5e9' }} px={4} py={1}>
              <Stack width="100%" direction="row" justifyContent="center">
                <Stack width="105mm" justifyContent="space-between">
                  <Typography component="Box" variant="caption">
                    <b>DATE:</b>&nbsp;
                    {formatFullDate(quotation.created_at)}&nbsp;&nbsp;|&nbsp;&nbsp;<b>QUOTE ID:</b>
                    &nbsp;
                    {`SAPL/NQ-${String(quotation.id).padStart(4, '0')}`}
                  </Typography>
                  <Typography component="Box" variant="caption">
                    {quotation.customer_name}
                  </Typography>
                </Stack>
                <Stack width="105mm" justifyContent="space-between" pl={3}>
                  <Typography gutterBottom variant="caption" color="#00c9bf">
                    <b>FOR MORE INFORMATION, CONTACT US</b>
                  </Typography>
                  <Typography component="Box" variant="caption">
                    <b>N</b> Suresh Kumar
                    <br />
                    <b>P</b> +91 99532 93117 , +91 93612 28567
                    {/* <b>P</b> +91 93612 28567 */}
                    <br />
                    <b>E</b> charterservices@sparzana.com
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                // borderTop: '1px solid #00f5e9',
                borderBottom: '1px solid #00f5e9',
              }}
            >
              <Stack width="100%" direction="row" justifyContent="center" px={4} py={1}>
                <Box width="105mm">
                  <Typography variant="caption" color="#00c9bf">
                    <b>YOUR AIRCRAFT</b>
                  </Typography>
                  <Typography variant="h6">
                    <b>{quotation.aircraft.model.aircraft_model}</b>
                  </Typography>
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}
                  >
                    Seating Capacity: Up to {quotation.aircraft.model.seats} passengers
                    <br />
                    Year of Manufacture: {quotation.aircraft.model.period_of_manufacture}
                  </Typography>
                </Box>
                <Box width="105mm" pl={3}>
                  <Typography variant="caption" color="#00c9bf">
                    <b>CHARTER OVERVIEW</b>
                  </Typography>
                  <Typography variant="h6">
                    <b>Charter Price</b> INR {formateCurrency(quotation.grand_total)}
                  </Typography>
                  <Typography component="div" sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                    Inclusive of 18% GST
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack width="100%" direction="row" justifyContent="center" px={4} py={1}>
              <Box width="120mm">
                <Typography variant="caption" component="div" gutterBottom color="#00c9bf">
                  <b>Notes :</b>
                </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}
                >
                  1. All quotations/options provided above are subject to all necessary permission
                  and aircraft availability at the time of charter confirmation.
                  <br />
                  2. Airport Handling Charges are approximation, this will be charged on actuals.
                  <br />
                  3. Flying time approximate may change on actuals.
                  <br />
                  4. TBL for pilots for any waiting beyond 4 hours or over night journeys will be
                  chargeable extra on Actuals.
                  <br />
                  5. This Quotes will valid for 24 Hours, but does not Guarantee a reservation/
                  Booking. Aircraft booking are always on first come first served basis.
                  <br />
                  {/* - Aircraft subject to availability at the time of confirmation
                        <br />
                        <br />
                        - 100% payment at the time confirmation
                        <br />
                        <br />- Subject to slots, permits, airport watch hours, weather, parking, NOTAM */}
                </Typography>
              </Box>
              {/* <Box width="90mm">
                      
             
                      <Box
                        
                        sx={{
                          height: '70mm',
                          backgroundImage: `url(/uploads/interiors/${quotation.aircraft.model.images.interior_image_1})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: 'contain',
                        }}
                      />
                    </Box> */}
              <Box width="90mm">
                <Box
                  sx={{
                    height: '70mm',
                    backgroundImage: `url(/uploads/interiors/${quotation.aircraft.model.images.interior_image_2})`,
                    backgroundRepeat: 'no-repeat',

                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                />
              </Box>
            </Stack>

            <Stack width="100%" direction="row" justifyContent="center" alignItems="center" px={4}>
              <Box width="80mm">
                <Box
                  sx={{
                    height: '40mm',
                    backgroundImage: `url(/uploads/cabins/${quotation.aircraft.model.images.cabin_image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                />
              </Box>
              <Box width="130mm">
                <Box
                  sx={{
                    height: '80mm',
                    backgroundImage: `url(/uploads/lopas/${quotation.aircraft.model.images.lopa_image})`,
                    backgroundRepeat: 'no-repeat',
                    transform: 'rotate(90deg)',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                />
              </Box>
            </Stack>

            <Box px={4} py={1}>
              <Typography variant="caption" component="div" gutterBottom color="#00c9bf">
                <b>Your Plan :</b>
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>FROM</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                        DEPARTURE DATE
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                        DEPATURE TIME
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>TO</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>DURATION</TableCell>
                      <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                        PASSENGERS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.trips.map((trip) => (
                      <TableRow
                        key={trip.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell
                          sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}
                          component="th"
                          scope="row"
                        >
                          {trip.departure_airport.airport_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                          {formatFullDate(trip.start_at)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                          {formatTime(trip.start_at)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                          {trip.arrival_airport.airport_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                          {convertToTimeString2(trip.duration)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                          {trip.pax}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box bgcolor={theme.palette.background.paper}>
          {/* First Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              py: '5mm',
              px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              ...bgGradient({
                color: alpha(theme.palette.background.paper, 0),
                imgUrl: '/assets/pdf_templates/quotation/firstpage.jpg',
              }),
            }}
          />
          {/* Second Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              //   py: '5mm',
              //   px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // ...bgGradient({
              //   color: alpha(theme.palette.background.paper, 0.9),
              //   imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
              // }),
            }}
          >
            {/* <Box
              component="img"
              height="26.50mm"
              width="100%"
              src="/assets/pdf_templates/quotation/header.png"
              alt="header"
            /> */}
            <Stack
              height="26.50mm"
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px="10mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>
            <Box
              sx={{
                width: '210mm',
                height: '170mm',
                py: '5mm',
                px: '10mm',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={quotation.is_simple === 'OnePage' ? 1 : 3}
              >
                <Box>
                  <Typography
                    gutterBottom
                    variant="body2"
                    fontWeight={theme.typography.fontWeightBold}
                    sx={{ fontSize: 11 }}
                  >
                    Dear Sir/Madam,
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    We are pleased to offer the {quotation.aircraft.model.aircraft_model} Aircraft
                    for your consideration.
                    <br />
                    The commercial terms for this offer are as follows:
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    <b>Date : </b>
                    {formatDate(quotation.created_at).weekday}{' '}
                    {formatDate(quotation.created_at).formattedDate}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    <b>Quote No : </b>
                    {`SAPL/QU-${String(quotation.id).padStart(4, '0')}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    <b>Aircraft : </b>
                    {quotation.aircraft.model.aircraft_model}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="body1"
                gutterBottom
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: 11 }}
              >
                Flight Details:
              </Typography>

              {quotation.is_simple === 'Detailed' && (
                <TableContainer sx={{ maxWidth: 'auto' }}>
                  <Table sx={{ minWidth: 400 }} aria-label="customized table" size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">Departure</StyledTableCell>
                        <StyledTableCell align="center">Arrival</StyledTableCell>
                        <StyledTableCell align="center">Fly&nbsp;Time</StyledTableCell>
                        <StyledTableCell align="center">ETD</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quotation.trips.map((trip, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {formatDate(trip.start_at).formattedDate}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {trip.departure_airport.airport_name}({trip.departure_airport.icao_code}
                            )
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {trip.arrival_airport.airport_name}({trip.arrival_airport.icao_code})
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {convertToTimeString2(trip.duration)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {/* {new Date(trip.start_at).toLocaleTimeString('en-GB')}
                             */}
                            {new Date(trip.start_at).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}{' '}
                            HRS
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {quotation.is_simple === 'Simplified' && (
                <Box>
                  <TableContainer sx={{ maxWidth: 'auto', mb: 1 }}>
                    <Table sx={{ minWidth: 400 }} aria-label="customized table" size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Date</StyledTableCell>
                          <StyledTableCell align="center">From</StyledTableCell>
                          <StyledTableCell align="center">To</StyledTableCell>
                          <StyledTableCell align="center">ETD</StyledTableCell>
                          <StyledTableCell align="center">Apx. Fly&nbsp;Time</StyledTableCell>
                          <StyledTableCell align="center">Pax</StyledTableCell>
                          <StyledTableCell align="center">Remarks</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {quotation.trips.map((trip, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">
                              {formatDate(trip.start_at).formattedDate}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {trip.departure_airport.city.city_name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {trip.arrival_airport.city.city_name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {new Date(trip.start_at).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })}{' '}
                              HRS
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {convertToTimeString2(trip.duration)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {trip.pax ? trip.pax : 'Ferry'}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {trip.pax ? 'With Pax' : 'Positioning'}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                        <StyledTableRow>
                          <StyledTableCell
                            align="right"
                            colSpan={4}
                            sx={{ fontWeight: theme.typography.fontWeightBold }}
                          >
                            Total Flying Hrs.
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            colSpan={3}
                            sx={{ fontWeight: theme.typography.fontWeightBold }}
                          >
                            {convertToTimeString2(quotation.duration)}
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography
                    variant="body1"
                    gutterBottom
                    fontWeight={theme.typography.fontWeightBold}
                    sx={{ fontSize: 11 }}
                  >
                    Trip Cost Estimation:
                  </Typography>
                  <TableContainer sx={{ mb: 1 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontSize: 11,
                              lineHeight: 1.1,
                              fontWeight: theme.typography.fontWeightBold,
                            }}
                          >
                            Cost Details
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontSize: 11,
                              lineHeight: 1.1,
                              fontWeight: theme.typography.fontWeightBold,
                            }}
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            Total Flying Cost ({convertToTimeString2(quotation.duration)})
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(quotation.trip_cost)}
                          </TableCell>
                        </TableRow> */}
                        {/* {quotation.charges.map((charge, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                              {charge.title}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                              {formateCurrency(charge.cost)}
                            </TableCell>
                          </TableRow>
                        ))} */}
                        {/* <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            Total Handling Cost
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(
                              quotation.charges.reduce(
                                (total, charge) => total + Number(charge.cost || 0),
                                0
                              )
                            )}
                          </TableCell>
                        </TableRow> */}
                        {/* <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>Sub Total</TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(quotation.sub_total)}
                          </TableCell>
                        </TableRow> */}
                        {/* <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>Discount</TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(quotation.discount)}
                          </TableCell>
                        </TableRow> */}
                        <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>Sub Total</TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(quotation.st_after_discount)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>GST (18%)</TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(quotation.gst)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: theme.typography.fontWeightBold,
                              fontSize: 10,
                              lineHeight: 1.1,
                            }}
                          >
                            Grand Total
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: theme.typography.fontWeightBold,
                              fontSize: 10,
                              lineHeight: 1.1,
                            }}
                          >
                            {formateCurrency(quotation.grand_total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography
                    variant="body1"
                    gutterBottom
                    fontWeight={theme.typography.fontWeightBold}
                    sx={{ fontSize: 11 }}
                  >
                    Please Note:
                  </Typography>

                  <Typography variant="body2" component="p" sx={{ fontSize: 11, lineHeight: 1.2 }}>
                    1. All quotations/options provided above are subject to all necessary permission
                    and aircraft availability at the time of charter confirmation.
                    <br />
                    2. Airport Handling Charges are approximation, this will be charged on actuals.
                    <br />
                    3. Flying time approximate may change on actuals.
                    <br />
                    4. TBL for pilots for any waiting beyond 4 hours or over night journeys will be
                    chargeable extra on Actuals.
                    <br />
                    5. This Quotes will valid for 24 Hours, but does not Guarantee a reservation/
                    Booking. Aircraft booking are always on first come first served basis.
                    <br />
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                position: 'relative',
                height: '100.50mm',
                ...bgGradient({
                  color: alpha(theme.palette.background.paper, 0),
                  imgUrl: `/uploads/aircrafts/${quotation.aircraft.model.images.aircraft_image_1}`,
                }),
              }}
            >
              {/* <Box
                component="img"
                src="/assets/pdf_templates/quotation/footer.png"
                alt="header"
                sx={{
                  height: '26.50mm',
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                }}
              /> */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  height: '26.50mm',
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  ...bgBlur({ color: '#ffffff', opacity: 0.5, blur: 1 }),
                }}
              >
                <Box>
                  <Divider sx={{ mb: 1 }}>
                    <Chip
                      label={
                        <Typography
                          variant="body1"
                          // gutterBottom
                          textAlign="center"
                          fontWeight={theme.typography.fontWeightBold}
                        >
                          Sparzana Aviation Pvt Ltd
                        </Typography>
                      }
                      size="small"
                    />
                  </Divider>

                  <Typography
                    variant="body2"
                    component="p"
                    textAlign="center"
                    sx={{ fontSize: 12 }}
                    fontWeight={theme.typography.fontWeightBold}
                  >
                    <Link
                      href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                      Nungambakkam, Chennai - 34, TN, India.
                    </Link>
                    <br /> Phone:&nbsp;
                    <Link
                      href="tel:+919953293117"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      +91 99532 93117
                    </Link>
                    {/* &nbsp;/&nbsp;
                    <Link
                      href="tel:+919102004389"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      +91 91020 04389
                    </Link> */}
                    &nbsp;| Email:&nbsp;
                    <Link
                      href="mailto:info@sparzana.com"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      info@sparzana.com
                    </Link>
                    &nbsp; | Website: &nbsp;
                    <Link
                      href="https://sparzana.com"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      https://sparzana.com
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Third Page */}
          {quotation.is_simple === 'Detailed' && (
            <Box
              sx={{
                width: '210mm',
                height: '297mm',
                //   py: '5mm',
                //   px: '10mm',
                boxSizing: 'border-box',
                pageBreakAfter: 'always',
                // ...bgGradient({
                //   color: alpha(theme.palette.background.paper, 0.9),
                //   imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
                // }),
              }}
            >
              {/* <Box
              component="img"
              height="26.50mm"
              width="100%"
              src="/assets/pdf_templates/quotation/header.png"
              alt="header"
            /> */}
              <Stack
                height="26.50mm"
                width="100%"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                px="10mm"
              >
                <Box
                  component="img"
                  src="/assets/logo/Refex-Logo.png"
                  alt="refex-logo"
                  height={35}
                />
                <Logo sx={{ width: 90, height: 75 }} />
              </Stack>

              <Box
                sx={{
                  width: '210mm',
                  height: '170mm',
                  py: '5mm',
                  px: '10mm',
                }}
              >
                <Typography
                  variant="body1"
                  gutterBottom
                  fontWeight={theme.typography.fontWeightBold}
                  sx={{ fontSize: 11 }}
                >
                  Trip Cost Estimation:
                </Typography>
                <TableContainer sx={{ maxWidth: 'auto', mb: 3 }}>
                  <Table sx={{ minWidth: 400 }} aria-label="customized table" size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">Departure</StyledTableCell>
                        <StyledTableCell align="center">Arrival</StyledTableCell>
                        <StyledTableCell align="center">Fly&nbsp;Time</StyledTableCell>
                        <StyledTableCell align="center">Pax</StyledTableCell>
                        <StyledTableCell align="center">Cost</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quotation.trips.map((trip, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {formatDate(trip.start_at).formattedDate}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {trip.departure_airport.city.city_name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {trip.arrival_airport.city.city_name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {convertToTimeString2(trip.duration)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {trip.pax ? trip.pax : 'Ferry'}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {formateCurrency(trip.cost)}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                      <StyledTableRow>
                        <StyledTableCell
                          align="right"
                          colSpan={5}
                          sx={{ fontWeight: theme.typography.fontWeightBold }}
                        >
                          Total
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ fontWeight: theme.typography.fontWeightBold }}
                        >
                          {formateCurrency(quotation.trip_cost)}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontSize: 11,
                            lineHeight: 1.1,
                            fontWeight: theme.typography.fontWeightBold,
                          }}
                        >
                          Cost Details
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: 11,
                            lineHeight: 1.1,
                            fontWeight: theme.typography.fontWeightBold,
                          }}
                        >
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          Total Flying Cost ({convertToTimeString2(quotation.duration)})
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formateCurrency(quotation.trip_cost)}
                        </TableCell>
                      </TableRow>
                      {quotation.charges.map((charge, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {charge.title}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                            {formateCurrency(charge.cost)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>Sub Total</TableCell>
                        <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formateCurrency(quotation.sub_total)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>Discount</TableCell>
                        <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formateCurrency(quotation.discount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          Sub Total (After Discount)
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formateCurrency(quotation.st_after_discount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontSize: 10, lineHeight: 1.1 }}>GST (18%)</TableCell>
                        <TableCell align="right" sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formateCurrency(quotation.gst)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: 10,
                            lineHeight: 1.1,
                          }}
                        >
                          Grand Total
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            fontSize: 10,
                            lineHeight: 1.1,
                          }}
                        >
                          {formateCurrency(quotation.grand_total)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  height: '100.50mm',
                }}
              >
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    position: 'absolute',
                    height: '100.50mm',
                    width: '100%',
                    bottom: 0,
                  }}
                >
                  <Box
                    sx={{
                      // position: 'absolute',
                      // height: '100.50mm',
                      width: '100%',
                      // bottom: 0,
                      ...bgGradient({
                        color: alpha(theme.palette.background.paper, 0),
                        imgUrl: `/uploads/interiors/${quotation.aircraft.model.images.interior_image_1}`,
                      }),
                    }}
                  />
                  <Box
                    sx={{
                      // position: 'absolute',
                      // height: '100.50mm',
                      width: '100%',
                      // bottom: 0,
                      ...bgGradient({
                        color: alpha(theme.palette.background.paper, 0),
                        imgUrl: `/uploads/interiors/${quotation.aircraft.model.images.interior_image_2}`,
                      }),
                    }}
                  />
                </Stack>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    height: '26.50mm',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    ...bgBlur({ color: '#ffffff', opacity: 0.5, blur: 1 }),
                  }}
                >
                  <Box>
                    <Divider sx={{ mb: 1 }}>
                      <Chip
                        label={
                          <Typography
                            variant="body1"
                            // gutterBottom
                            textAlign="center"
                            fontWeight={theme.typography.fontWeightBold}
                          >
                            Sparzana Aviation Pvt Ltd
                          </Typography>
                        }
                        size="small"
                      />
                    </Divider>

                    <Typography
                      variant="body2"
                      component="p"
                      textAlign="center"
                      sx={{ fontSize: 12 }}
                      fontWeight={theme.typography.fontWeightBold}
                    >
                      <Link
                        href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                        Nungambakkam, Chennai - 34, TN, India.
                      </Link>
                      <br /> Phone:&nbsp;
                      <Link
                        href="tel:+919953293117"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        +91 99532 93117
                      </Link>
                      {/* &nbsp;/&nbsp;
                    <Link
                      href="tel:+919102004389"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      +91 91020 04389
                    </Link> */}
                      &nbsp;| Email:&nbsp;
                      <Link
                        href="mailto:info@sparzana.com"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        info@sparzana.com
                      </Link>
                      &nbsp; | Website: &nbsp;
                      <Link
                        href="https://sparzana.com"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        https://sparzana.com
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          {/* Fourth Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              //   py: '5mm',
              //   px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // ...bgGradient({
              //   color: alpha(theme.palette.background.paper, 0.9),
              //   imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
              // }),
            }}
          >
            {/* <Box
              component="img"
              height="26.50mm"
              width="100%"
              src="/assets/pdf_templates/quotation/header.png"
              alt="header"
            /> */}
            <Stack
              height="26.50mm"
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px="10mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>

            <Box
              sx={{
                width: '210mm',
                height: quotation.is_simple === 'Detailed' ? '100mm' : '170mm',
                py: '5mm',
                px: '10mm',
              }}
            >
              <Stack gap={15}>
                <Box>
                  <Typography
                    variant="body1"
                    gutterBottom
                    fontWeight={theme.typography.fontWeightBold}
                    sx={{ fontSize: 11 }}
                  >
                    Aircraft Specification:
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" pr={7}>
                    <TableContainer sx={{ maxWidth: 400 }}>
                      <Table sx={{ maxWidth: 400 }} aria-label="customized table" size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell align="center">Attribute</StyledTableCell>
                            <StyledTableCell align="center">Value</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell align="center">Aircraft Model</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.aircraft_model}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Aircraft Type</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.aircraft_type}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Baggage Capacity</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.baggage_capacity
                                ? `(${quotation.aircraft.model.baggage_capacity} lbs)`
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Cruise Speed</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.max_cruising_speed} kn
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Max Passenger</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.seats}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Year of Manufacture</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.period_of_manufacture}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Home Base</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.base_airport
                                ? quotation.aircraft.model.base_airport.city.city_name
                                : '-'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Pilots</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.pilots
                                ? quotation.aircraft.model.pilots
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">
                              Max. Range / Flying Range
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.range
                                ? `${quotation.aircraft.model.range} nm`
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Cabin Height</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.cabin_height
                                ? `${quotation.aircraft.model.cabin_height} ft`
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Cabin Width</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.cabin_width
                                ? `${quotation.aircraft.model.cabin_width} ft`
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Cabin Length</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.cabin_length
                                ? `${quotation.aircraft.model.cabin_length} ft`
                                : 'N/A'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">WiFi</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.wifi_availability ? 'Yes' : 'No'}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell align="center">Lavatory</StyledTableCell>
                            <StyledTableCell align="center">
                              {quotation.aircraft.model.lavatory ? 'Yes' : 'No'}
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box
                      component="img"
                      src={`/uploads/lopas/${quotation.aircraft.model.images.lopa_image}`}
                      alt="lopa"
                    />
                  </Stack>
                </Box>
                {quotation.is_simple === 'Detailed' && (
                  <Box>
                    <Typography
                      variant="body1"
                      gutterBottom
                      fontWeight={theme.typography.fontWeightBold}
                      sx={{ fontSize: 11 }}
                    >
                      Please Note:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ fontSize: 11, lineHeight: 1.2 }}
                    >
                      1. All quotations/options provided above are subject to all necessary
                      permission and aircraft availability at the time of charter confirmation.
                      <br />
                      <br />
                      2. Airport Handling Charges are approximation, this will be charged on
                      actuals.
                      <br />
                      <br />
                      3. Flying time approximate may change on actuals.
                      <br />
                      <br />
                      4. TBL for pilots for any waiting beyond 4 hours or over night journeys will
                      be chargeable extra on Actuals.
                      <br />
                      <br />
                      5. This Quotes will valid for 24 Hours, but does not Guarantee a reservation/
                      Booking. Aircraft booking are always on first come first served basis.
                      <br />
                      <br />
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* <Box
              component="img"
              src="/assets/pdf_templates/quotation/footer.png"
              alt="header"
              sx={{
                bgcolor: theme.palette.background.paper,
                height: '26.50mm',
                width: '100%',
              }}
            /> */}
            {quotation.is_simple === 'Simplified' ? (
              <Box
                sx={{
                  position: 'relative',
                  height: '100.50mm',
                }}
              >
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    position: 'absolute',
                    height: '100.50mm',
                    width: '100%',
                    bottom: 0,
                  }}
                >
                  <Box
                    sx={{
                      // position: 'absolute',
                      // height: '100.50mm',
                      width: '100%',
                      // bottom: 0,
                      ...bgGradient({
                        color: alpha(theme.palette.background.paper, 0),
                        imgUrl: `/uploads/interiors/${quotation.aircraft.model.images.interior_image_1}`,
                      }),
                    }}
                  />
                  <Box
                    sx={{
                      // position: 'absolute',
                      // height: '100.50mm',
                      width: '100%',
                      // bottom: 0,
                      ...bgGradient({
                        color: alpha(theme.palette.background.paper, 0),
                        imgUrl: `/uploads/interiors/${quotation.aircraft.model.images.interior_image_2}`,
                      }),
                    }}
                  />
                </Stack>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    height: '26.50mm',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    ...bgBlur({ color: '#ffffff', opacity: 0.5, blur: 1 }),
                  }}
                >
                  <Box>
                    <Divider sx={{ mb: 1 }}>
                      <Chip
                        label={
                          <Typography
                            variant="body1"
                            // gutterBottom
                            textAlign="center"
                            fontWeight={theme.typography.fontWeightBold}
                          >
                            Sparzana Aviation Pvt Ltd
                          </Typography>
                        }
                        size="small"
                      />
                    </Divider>

                    <Typography
                      variant="body2"
                      component="p"
                      textAlign="center"
                      sx={{ fontSize: 12 }}
                      fontWeight={theme.typography.fontWeightBold}
                    >
                      <Link
                        href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                        Nungambakkam, Chennai - 34, TN, India.
                      </Link>
                      <br /> Phone:&nbsp;
                      <Link
                        href="tel:+919953293117"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        +91 99532 93117
                      </Link>
                      {/* &nbsp;/&nbsp;
                    <Link
                      href="tel:+919102004389"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      +91 91020 04389
                    </Link> */}
                      &nbsp;| Email:&nbsp;
                      <Link
                        href="mailto:info@sparzana.com"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        info@sparzana.com
                      </Link>
                      &nbsp; | Website: &nbsp;
                      <Link
                        href="https://sparzana.com"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                      >
                        https://sparzana.com
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  height: '26.50mm',
                  width: '100%',
                  // ...bgBlur({ opacity: 0.3 }),
                }}
              >
                <Box>
                  <Divider sx={{ mb: 1 }}>
                    <Chip
                      label={
                        <Typography
                          variant="body1"
                          // gutterBottom
                          textAlign="center"
                          fontWeight={theme.typography.fontWeightBold}
                        >
                          Sparzana Aviation Pvt Ltd
                        </Typography>
                      }
                      size="small"
                    />
                  </Divider>

                  <Typography
                    variant="body2"
                    component="p"
                    textAlign="center"
                    sx={{ fontSize: 11 }}
                    fontWeight={theme.typography.fontWeightBold}
                  >
                    <Link
                      href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                      Nungambakkam, Chennai - 34, TN, India.
                    </Link>
                    <br /> Phone:&nbsp;
                    <Link
                      href="tel:+919953293117"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      +91 99532 93117
                    </Link>
                    {/* &nbsp;/&nbsp;
                  <Link
                    href="tel:+919102004389"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    +91 91020 04389
                  </Link> */}
                    &nbsp;| Email:&nbsp;
                    <Link
                      href="mailto:info@sparzana.com"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      info@sparzana.com
                    </Link>
                    &nbsp; | Website: &nbsp;
                    <Link
                      href="https://sparzana.com"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      https://sparzana.com
                    </Link>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          {/* Five Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              //   py: '5mm',
              //   px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // ...bgGradient({
              //   color: alpha(theme.palette.background.paper, 0.9),
              //   imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
              // }),
            }}
          >
            {/* <Box
              component="img"
              height="26.50mm"
              width="100%"
              src="/assets/pdf_templates/quotation/header.png"
              alt="header"
            /> */}
            <Stack
              height="26.50mm"
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px="10mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>

            <Box
              sx={{
                width: '210mm',
                height: '244mm',
                py: '5mm',
                px: '10mm',
              }}
            >
              <Typography
                variant="body1"
                gutterBottom
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: 11 }}
              >
                Terms & Conditions:
              </Typography>
              <Typography variant="body2" component="p" sx={{ fontSize: 11, lineHeight: 1.2 }}>
                1. We would require the requested information within the stipulated timelines, in
                order to enable us to seek the necessary permissions for the effecting of the
                flight.
                <br />
                <br />
                2. Sparzana Aviation Private Limited will not be responsible in any manner
                whatsoever for passengers traveling without the relevant travel documents and/or,
                carrying any contraband items and/or, involved/indulging in any illegal activities.
                <br />
                <br />
                3. Minimum 2 hours ‘per aircraft per day’ or actuals ‘per aircraft per day’,
                whichever is higher – will charged for a booking.
                <br />
                <br />
                4. If there is no flying on a particular day of a Charter, a minimum of 2 (two) hour
                of flying time will be charged as “Non-Flying Day Charge” and in this case, no night
                halt charge will be levied.
                <br />
                <br />
                5. Flying hour charges include the cost of the Aircraft fuel, oil, maintenance,
                landing and day parking charges, standard in-flight meals, navigation fees and
                dispatch cost of the aircraft.
                <br />
                <br />
                6. In addition to applicable Taxes, we would be charging for the below mentioned
                items:
                {/* <br /> */}
                {/* a. Domestic Flights: */}
                <br />
                (i) Ground Handling service charges
                <br /> (ii) Extension of watch hours (if applicable) <br />
                (iii) Day Detention charges are applicable after 4 hours of waiting at a
                destination. <br />
                (iv) Night Halt charges (if applicable)
                <br />
                <br />
                {/* 7. Advance Payment: A minimum booking amount of 10% of quoted value, must be
                deposited to block the charter. Charters shall be solely made available to the
                parties on First Come,First Served basis. */}
                7. Crew and Aircraft:
                <br />
                - Crew accommodation, food, and transportation charges (Rs. 75,000/-) will be
                applied for halts over 3 hours.
                <br />
                - Watch hour extension charges will be applicable.
                <br />
                - Block time is calculated from engine start to shutdown.
                <br />
                <br />
                8. Payment Terms:
                <br />
                - 25% advance payment to block the aircraft.
                <br />
                - 100% payment (confirmation charges) 7 days prior to flying commitment.
                <br />
                - Final billing will be based on actual flight logs or quote, whichever is higher.
                <br />
                <br />
                9. Balance Payment: The balance payable is payable no later than 72 hours before the
                operation of your first flight If the booking is made within 72 hours of the
                operation of Charterer’s first flight, the full amount of the Charter Quote is
                payable to us at that time. Charterer understands and agrees that the time of
                payment is an essential term of this Agreement. Sparzana Aviation reserves its right
                to withhold services until it receives payment of the full amount of the Charter
                Quote. Should Charterer fail to pay the charter quote in time, then the flight will
                become subject to availability again and may by cancelled by Sparzana Aviation
                without recourse to Charterer.
                <br />
                <br />
                10. Cancellation Charges:
                <br />
                - 50% of total estimated charter cost if cancelled after aircraft blocking.
                <br />
                - 75% if cancelled within 48 hours of scheduled departure.
                <br />
                - 100% if cancelled within 36 hours or in case of no show.
                <br />- Rs. 50,000/-flight preparation charges if cancelled due to force majeure.
                {/* 9. Cancellation Terms Should a confirmed flight be cancelled by Charterer; a
                cancellation fee will be levied as followed against the full charter price:
                <br />
                (i) 10% with immediate effect <br />
                (ii) 25% if cancelled within 14 days of the proposed schedule
                <br />
                (iii) 50% if cancelled within 7 days of the proposed schedule
                <br />
                (iv) 75% if cancelled within 3 days of the proposed schedule
                <br />
                (v) 100% if cancelled on the day of the flight or if the aircraft has positioned. */}
                <br />
                <br />
                11. Any changes/modification of ‘flight program’, requested by the customer after
                commencement of the ‘flight program’ and if the same cannot be executed due to
                operational reasons/lapse of relevant permissions in flight sectors will be termed
                as ‘a last-minute cancellation’ and the cancellation clause of 100% would apply.
                <br />
                <br />
                12. If due to sudden deterioration of weather en-route/destination, the aircraft
                cannot land at the Destination OR diverted due to defense services activity AND has
                to return to the starting point or divert to some other airport, the actual flying
                time and any other additional charges due to the diversion would be chargeable and
                balance if any, would be payable / refundable.
                <br />
                <br />
                13. The above quote is only indicative and any extra flying on account of diversions
                due to Air Traffic Control; extra fueling halt on account of aircraft performance
                due to weight, altitude, temperature and range limitations will be billed at
                actuals, after the flight is conducted in the Final Invoice.
                <br />
                <br />
                14. Sparzana Aviation Private Limited cannot be held responsible for non-operation
                of charter for any unforeseen reason/s such as Bad Weather,Poor Visibility, non –
                Availability of clearances from ATC / Defense Authorities / Civil Administration.
                Due to above reasons, if the flight cannot take off from the Originating station
                full amount will be refunded (except IFS charges).
              </Typography>
            </Box>

            {/* <Box
              component="img"
              src="/assets/pdf_templates/quotation/footer.png"
              alt="header"
              sx={{
                bgcolor: theme.palette.background.paper,
                height: '26.50mm',
                width: '100%',
              }}
            /> */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                height: '26.50mm',
                width: '100%',
                // ...bgBlur({ opacity: 0.3 }),
              }}
            >
              <Box>
                <Divider sx={{ mb: 1 }}>
                  <Chip
                    label={
                      <Typography
                        variant="body1"
                        // gutterBottom
                        textAlign="center"
                        fontWeight={theme.typography.fontWeightBold}
                      >
                        Sparzana Aviation Pvt Ltd
                      </Typography>
                    }
                    size="small"
                  />
                </Divider>

                <Typography
                  variant="body2"
                  component="p"
                  textAlign="center"
                  sx={{ fontSize: 11 }}
                  fontWeight={theme.typography.fontWeightBold}
                >
                  <Link
                    href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                    Nungambakkam, Chennai - 34, TN, India.
                  </Link>
                  <br /> Phone:&nbsp;
                  <Link
                    href="tel:+919953293117"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    +91 99532 93117
                  </Link>
                  {/* &nbsp;/&nbsp;
                  <Link
                    href="tel:+919102004389"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    +91 91020 04389
                  </Link> */}
                  &nbsp;| Email:&nbsp;
                  <Link
                    href="mailto:info@sparzana.com"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    info@sparzana.com
                  </Link>
                  &nbsp; | Website: &nbsp;
                  <Link
                    href="https://sparzana.com"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    https://sparzana.com
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Six Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              //   py: '5mm',
              //   px: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // ...bgGradient({
              //   color: alpha(theme.palette.background.paper, 0.9),
              //   imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
              // }),
            }}
          >
            {/* <Box
              component="img"
              height="26.50mm"
              width="100%"
              src="/assets/pdf_templates/quotation/header.png"
              alt="header"
            /> */}
            <Stack
              height="26.50mm"
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px="10mm"
            >
              <Box component="img" src="/assets/logo/Refex-Logo.png" alt="refex-logo" height={35} />
              <Logo sx={{ width: 90, height: 75 }} />
            </Stack>

            <Box
              sx={{
                width: '210mm',
                height: '244mm',
                py: '5mm',
                px: '10mm',
              }}
            >
              <Typography
                variant="body2"
                component="p"
                sx={{ fontSize: 11, lineHeight: 1.2, mb: 7 }}
              >
                15. Bank Details: <br />
                {/* <TableContainer sx={{ maxWidth: 400 }}>
                  <Table sx={{ maxWidth: 400 }} aria-label="customized table" size="small">
                    <TableBody>
                      <TableRow>
                        <StyledTableCell width={140}>Account Name</StyledTableCell>
                        <StyledTableCell align="center">
                          SPARZANA AVIATION PRIVATE LIMITED
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell width={140}>Account No</StyledTableCell>
                        <StyledTableCell align="center">012221010000057</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell width={140}>Bank Name</StyledTableCell>
                        <StyledTableCell align="center">Union Bank of India</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell width={140}>RTGS/IFSC</StyledTableCell>
                        <StyledTableCell align="center">UBIN0901229</StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell width={140}>Branch</StyledTableCell>
                        <StyledTableCell align="center">
                          Whites Road Branch, Chennai.
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell width={140}>MICR Code</StyledTableCell>
                        <StyledTableCell align="center">600026149</StyledTableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer> */}
                <Box
                  component="img"
                  height="35mm"
                  src="/assets/pdf_templates/quotation/bankdetails.jpg"
                  alt="header"
                />
                <br />
                <br />
                16. Onboard Services:
                <br />
                Non-veg food, smoking and alcohol consumption are not permitted. One baggage (15
                kgs, 22&quot; size) and one small handbag are allowed per passenger. Complimentary
                bottled water, juices, biscuits and dry snacks will be provided. Additional catering
                (Vegetarian food) can be requested in advance at an extra charge.
                <br />
                <br />
                17. MANDATORY INFORMATION:
                <br />
                Passengers must always carry, at the time of entry and/or exit from Airports a valid
                Photo Identification Proof, which may be 1. Passport; 2. Aadhaar Card; 3. Voter Id
                Card; 4. PAN Card; 5. Driving License;6. Nationalized Bank Passbook with an attested
                photograph; 7. A Valid Government / State Government/ Armed Services issued Service
                Photo ID card; 8. Pension Card / Disability Card with attested Photograph issued by
                valid Government / State Government.
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: 11 }}
              >
                Dear Guest
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{ fontSize: 11, lineHeight: 1.2, mb: 5 }}
              >
                Greetings from SPARZANA AVIATION PRIVATE LIMITED!!!
                <br />
                <br />
                You are requested to kindly avoid carrying the following items equipment’s along
                with you while boarding the aircraft. These items are prohibited to be carried
                onboard by the Director General of Civil Aviation of India. The client here by
                agrees to the terms and conditions of the charter as defined above.
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ fontSize: 11, lineHeight: 1.2 }}
              >
                The client hereby agrees to the terms and conditions of the charter as defined
                above.
              </Typography>
              <Box
                component="img"
                src="/assets/pdf_templates/quotation/discription.png"
                alt="Discription"
                mb={10}
              />
              <Stack
                px={3}
                mb={3}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  fontWeight={theme.typography.fontWeightBold}
                  sx={{ fontSize: 11, lineHeight: 1.2 }}
                >
                  For SPARZANA AVIATION PRIVATE LIMITED
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={theme.typography.fontWeightBold}
                  sx={{ fontSize: 11, lineHeight: 1.2 }}
                >
                  For Client
                </Typography>
              </Stack>
              <Logo sx={{ width: 90, height: 75, ml: 13 }} />
            </Box>
            {/* <Box
              component="img"
              src="/assets/pdf_templates/quotation/footer.png"
              alt="header"
              sx={{
                bgcolor: theme.palette.background.paper,
                height: '26.50mm',
                width: '100%',
              }}
            /> */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                height: '26.50mm',
                width: '100%',
                // ...bgBlur({ opacity: 0.3 }),
              }}
            >
              <Box>
                <Divider sx={{ mb: 1 }}>
                  <Chip
                    label={
                      <Typography
                        variant="body1"
                        // gutterBottom
                        textAlign="center"
                        fontWeight={theme.typography.fontWeightBold}
                      >
                        Sparzana Aviation Pvt Ltd
                      </Typography>
                    }
                    size="small"
                  />
                </Divider>

                <Typography
                  variant="body2"
                  component="p"
                  textAlign="center"
                  sx={{ fontSize: 11 }}
                  fontWeight={theme.typography.fontWeightBold}
                >
                  <Link
                    href="https://maps.app.goo.gl/mZuAtwGJqwLniG1S9"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Rd,
                    Nungambakkam, Chennai - 34, TN, India.
                  </Link>
                  <br /> Phone:&nbsp;
                  <Link
                    href="tel:+919953293117"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    +91 99532 93117
                  </Link>
                  {/* &nbsp;/&nbsp;
                  <Link
                    href="tel:+919102004389"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    +91 91020 04389
                  </Link> */}
                  &nbsp;| Email:&nbsp;
                  <Link
                    href="mailto:info@sparzana.com"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    info@sparzana.com
                  </Link>
                  &nbsp; | Website: &nbsp;
                  <Link
                    href="https://sparzana.com"
                    underline="hover"
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                  >
                    https://sparzana.com
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
