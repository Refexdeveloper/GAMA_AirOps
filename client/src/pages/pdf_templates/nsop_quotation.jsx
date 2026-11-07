/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  Link,
  Stack,
  Chip,
  Table,
  Paper,
  useTheme,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Typography,
  TableContainer,
  Divider,
} from '@mui/material';

import Logo from 'src/components/logo';

const authToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY';

const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();

  return `${weekday} ${day} ${month} ${year}`;
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB'); // 24-hour format
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
const formateCurrency = (value = 0) =>
  value
    ? value.toLocaleString('en-IN', {
        // style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : '₹0';

export default function Quotation() {
  const { quoteId } = useParams();
  const theme = useTheme();
  const [quotation, setQuotation] = useState({
    id: 0,
    aircraft_image: '',
    trips: [],
    created_at: null,
  });
  console.log(quotation);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/pdf_data/nsop_quotation/${quoteId}`, { headers: { Authorization: authToken } })
        .then((res) => setQuotation(res.data.results));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {quotation.id ? (
        <Box bgcolor={theme.palette.background.paper}>
          {/* First Page */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
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
                height: '50mm',
                backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.aircraft_image})`,
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
                    <b>P</b> +91 93612 28567 , +91 98189 96840
                    <br />
                    {/* <b>P</b> +91 93612 28567 */}
                    {/* <br /> */}
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
                    <b>{quotation.aircraft_name}</b>
                  </Typography>
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}
                  >
                    Seating Capacity: Up to {quotation.aircraft_pax} passengers
                    <br />
                    Year of Manufacture: {quotation.manufacture_year}
                  </Typography>
                </Box>
                <Box width="105mm" pl={3}>
                  <Typography variant="caption" color="#00c9bf">
                    <b>CHARTER OVERVIEW</b>
                  </Typography>
                  <Typography variant="h6">
                    <b>Charter Price</b> INR {formateCurrency(quotation.price)}
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
                  - Aircraft subject to availability at the time of confirmation
                  <br />
                  <br />
                  - 100% payment at the time confirmation
                  <br />
                  <br />- Subject to slots, permits, airport watch hours, weather, parking, NOTAM
                </Typography>
              </Box>
              <Box width="90mm">
                <Box
                  sx={{
                    height: '50mm',
                    backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.interior_image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                />
              </Box>
            </Stack>

            <Stack
              width="100%"
              direction="row"
              justifyContent="center"
              alignItems="center"
              px={4}
              py={1}
            >
              <Box width="80mm">
                <Box
                  sx={{
                    height: '40mm',
                    backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.cabin_image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                />
              </Box>
              <Box width="130mm">
                <Box
                  sx={{
                    height: '30mm',
                    backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.lopa_image})`,
                    backgroundRepeat: 'no-repeat',
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

          {/* Second Page (Aircraft Specification - images only) */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
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
                Aircraft Specification:
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    height: '75mm',
                    width: '100%',
                    backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.lopa_image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    border: '1px solid #00000012',
                  }}
                />

                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      height: '120mm',
                      width: '50%',
                      backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.cabin_image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      border: '1px solid #00000012',
                    }}
                  />
                  <Box
                    sx={{
                      height: '120mm',
                      width: '50%',
                      backgroundImage: `url(/uploads/nsop_quotation/images/${quotation.interior_image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      border: '1px solid #00000012',
                    }}
                  />
                </Stack>
              </Stack>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: '26.50mm', width: '100%' }}
            >
              <Box>
                <Divider sx={{ mb: 1 }}>
                  <Chip
                    label={
                      <Typography
                        variant="body1"
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

          {/* Third Page (Terms & Conditions) */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
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
                <br />
                (i) Ground Handling service charges
                <br /> (ii) Extension of watch hours (if applicable) <br />
                (iii) Day Detention charges are applicable after 4 hours of waiting at a
                destination. <br />
                (iv) Night Halt charges (if applicable)
                <br />
                <br />
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

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: '26.50mm', width: '100%' }}
            >
              <Box>
                <Divider sx={{ mb: 1 }}>
                  <Chip
                    label={
                      <Typography
                        variant="body1"
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

          {/* Fourth Page (Bank Details / Mandatory Info) */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
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
              <Typography variant="body2" component="p" sx={{ fontSize: 11, lineHeight: 1.2, mb: 7 }}>
                15. Bank Details: <br />
                <Box
                  component="img"
                  height="35mm"
                  src="/assets/pdf_templates/quotation/bankdetails.jpg"
                  alt="bank-details"
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
              <Typography variant="body2" component="p" sx={{ fontSize: 11, lineHeight: 1.2, mb: 5 }}>
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
                The client hereby agrees to the terms and conditions of the charter as defined above.
              </Typography>
              <Box
                component="img"
                src="/assets/pdf_templates/quotation/discription.png"
                alt="Discription"
                mb={10}
              />
              <Stack px={3} mb={3} direction="row" justifyContent="space-between" alignItems="center">
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

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: '26.50mm', width: '100%' }}
            >
              <Box>
                <Divider sx={{ mb: 1 }}>
                  <Chip
                    label={
                      <Typography
                        variant="body1"
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
      ) : (
        <Box component="p">Failed to load pdf..!</Box>
      )}
    </Box>
  );
}
