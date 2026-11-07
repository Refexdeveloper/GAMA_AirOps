/* eslint-disable import/no-unresolved */
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Link, alpha, Stack, useTheme, Typography } from '@mui/material';

import { bgBlur, bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const authToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY';

const formatDate = (date) => {
  const optionsWeekday = { weekday: 'long' };
  const weekday = new Date(date).toLocaleDateString('en-GB', optionsWeekday);

  const day = new Date(date).getDate();
  const month = new Date(date).toLocaleString('en-GB', { month: 'long' });
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

const DateDisplay = ({ date, ...props }) => {
  const { weekday, formattedDate } = formatDate(date);
  return (
    <Typography {...props} variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
      {weekday} {formattedDate}
    </Typography>
  );
};

DateDisplay.propTypes = {
  date: PropTypes.string,
};

const PhoneDisplay = ({ phone }) => {
  const formattedPhoneNumber = formatePhone(phone);
  return (
    <Link href={`tel:${phone}`}>
      <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
        {formattedPhoneNumber}
      </Typography>
    </Link>
  );
};

PhoneDisplay.propTypes = {
  phone: PropTypes.string,
};

export default function BriefSheet() {
  const { sheetId } = useParams();
  const theme = useTheme();
  const [sheet, setSheet] = useState({ trips: [] });

  console.log(sheet);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/pdf_data/brief_sheet/${sheetId}`, { headers: { Authorization: authToken } })
        .then((res) => setSheet(res.data.results));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {sheet ? (
        <Box>
          {sheet.trips.map((trip, index) => (
            <Box
              key={index}
              sx={{
                width: '210mm',
                height: '297mm',
                py: '5mm',
                px: '10mm',
                boxSizing: 'border-box',
                ...(sheet.trips.length > 1 && { pageBreakAfter: 'always' }),
                // border: '0.1px dotted',
                ...bgGradient({
                  color: alpha(theme.palette.background.paper, 0.9),
                  imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
                }),
              }}
            >
              <Stack mb={3} direction="row" justifyContent="space-between" alignItems="center">
                <Logo sx={{ width: 90, height: 75 }} />
                <Box
                  component="img"
                  src="/assets/logo/Refex-Logo.png"
                  alt="refex-logo"
                  height={35}
                />
              </Stack>
              {index === 0 && (
                <>
                  <Stack mb={3} direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                        <b>Date : </b> <DateDisplay component="span" date={sheet.created_at} />
                      </Typography>
                    </Box>
                    <Box>
                      <Stack justifyContent="flex-start">
                        <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                          <b>Sheet No : </b>
                          {`SAPL/FBS-${String(sheet.id).padStart(4, '0')}`}
                        </Typography>

                        {/* <Box>Date : {new Date(sheet.created_at).toLocaleDateString('en-GB')}</Box> */}
                        {/* <Box>Customer : {sheet.customer_name}</Box> */}
                      </Stack>
                    </Box>
                  </Stack>

                  <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                    <b>Dear Sir/Madam,</b>
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                    Sparzana Aviation is now pleased to confirm the following for your upcoming
                    flight:
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // color: 'white',
                      // backgroundColor: '#2879b6',
                      // borderRadius: '3px',
                      mt: 5,
                      mb: 2,
                    }}
                  >
                    <Iconify icon="material-symbols:travel-luggage-and-bags" />
                    &nbsp;
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Booking Details
                    </Typography>
                  </Box>

                  <Stack mb={5} gap={2} direction="row" justifyContent="space-between">
                    <Box
                      sx={{
                        borderRadius: '3px',
                        p: 0.3,
                        width: '100%',
                        ...bgBlur({
                          color: theme.palette.grey[500],
                          opacity: 0.1,
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          backgroundColor: '#ee6a31',
                          borderRadius: '3px',
                          pl: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                          Date
                        </Typography>
                      </Box>
                      <Box p={1}>
                        <DateDisplay date={sheet.created_at} />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '3px',
                        p: 0.3,
                        width: '100%',
                        ...bgBlur({
                          color: theme.palette.grey[500],
                          opacity: 0.1,
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          backgroundColor: '#ee6a31',
                          borderRadius: '3px',
                          pl: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                          Customer
                        </Typography>
                      </Box>
                      <Box p={1}>
                        <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                          {sheet.customer_name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '3px',
                        p: 0.3,
                        minWidth: '70mm',
                        ...bgBlur({
                          color: theme.palette.grey[500],
                          opacity: 0.1,
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          backgroundColor: '#ee6a31',
                          borderRadius: '3px',
                          pl: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                          Contact Details
                        </Typography>
                      </Box>
                      <Stack
                        p={1}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={theme.typography.fontWeightBold}
                            sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                          >
                            Flight Manager :
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                            {sheet.flight_manager}
                          </Typography>
                          <PhoneDisplay phone={sheet.flight_manager_phone} />
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={theme.typography.fontWeightBold}
                            sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                          >
                            Operation Manager :
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                            {sheet.operation_manager}
                          </Typography>
                          <PhoneDisplay phone={sheet.operation_manager_phone} />
                        </Box>
                      </Stack>
                      {/* <Grid container spacing={3} p={1}>
                        <Grid md={6}>
                          <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                            Flight Manager
                          </Typography>
                          <Typography variant="body2">{sheet.flight_manager}</Typography>
                          <PhoneDisplay phone={sheet.flight_manager_phone} />
                        </Grid>
                        <Grid md={6}>
                          <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                            Operation Manager
                          </Typography>
                          <Typography variant="body2">{sheet.operation_manager}</Typography>
                          <PhoneDisplay phone={sheet.operation_manager_phone} />
                        </Grid>
                      </Grid> */}
                    </Box>
                  </Stack>
                  {/* <Grid container spacing={2} mb={2}>
                    <Grid md={2}>
                      <Box
                        sx={{
                          borderRadius: '3px',
                          p: 0.3,
                          height: '100%',
                          ...bgBlur({
                            color: theme.palette.grey[500],
                            opacity: 0.1,
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            color: 'white',
                            backgroundColor: '#ee6a31',
                            borderRadius: '3px',
                            pl: 1,
                          }}
                        >
                          Date
                        </Box>
                        <DateDisplay date={sheet.created_at} />
                      </Box>
                    </Grid>
                    <Grid md={3}>
                      <Box
                        sx={{
                          borderRadius: '3px',
                          p: 0.3,
                          height: '100%',
                          ...bgBlur({
                            color: theme.palette.grey[500],
                            opacity: 0.1,
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            color: 'white',
                            backgroundColor: '#ee6a31',
                            borderRadius: '3px',
                            pl: 1,
                          }}
                        >
                          Customer
                        </Box>
                        <Typography variant="body2" p={1}>
                          {sheet.customer_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid md={7}>
                      <Box
                        sx={{
                          borderRadius: '3px',
                          p: 0.3,
                          height: '100%',
                          width: '100%',
                          ...bgBlur({
                            color: theme.palette.grey[500],
                            opacity: 0.1,
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            color: 'white',
                            backgroundColor: '#ee6a31',
                            borderRadius: '3px',
                            pl: 1,
                          }}
                        >
                          Contact Details
                        </Box>
                        <Grid container spacing={3} p={1}>
                          <Grid md={6}>
                            <Typography
                              variant="body2"
                              fontWeight={theme.typography.fontWeightBold}
                            >
                              Flight Manager
                            </Typography>
                            <Typography variant="body2">{sheet.flight_manager}</Typography>
                            <PhoneDisplay phone={sheet.flight_manager_phone} />
                          </Grid>
                          <Grid md={6}>
                            <Typography
                              variant="body2"
                              fontWeight={theme.typography.fontWeightBold}
                            >
                              Operation Manager
                            </Typography>
                            <Typography variant="body2">{sheet.operation_manager}</Typography>
                            <PhoneDisplay phone={sheet.operation_manager_phone} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid> */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // color: 'white',
                      // backgroundColor: '#2879b6',
                      // borderRadius: '3px',
                      mb: 2,
                    }}
                  >
                    <Iconify icon="mdi:flight" />
                    &nbsp;
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Flight Details
                    </Typography>
                  </Box>
                </>
              )}
              <Box mb={2}>
                <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                  Trip {index + 1} :
                </Typography>
              </Box>
              <Stack mb={2} gap={2} direction="row" justifyContent="space-between">
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    width: '100%',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Date
                    </Typography>
                  </Box>
                  <Box p={1}>
                    <DateDisplay date={trip.start_at} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    width: '100%',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Aircraft
                    </Typography>
                  </Box>
                  <Box p={1}>
                    <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                      {sheet.aircraft.model.aircraft_model}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    minWidth: '70mm',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Report Time
                    </Typography>
                  </Box>
                  <Box p={1}>
                    <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                      30 Minutes prior to departure airport
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* <Grid container spacing={1} mb={2} width={1}>
                <Grid md={2}>
                  <Box
                    sx={{
                      borderRadius: '3px',
                      p: 0.3,
                      height: '100%',
                      width: '100%',
                      ...bgBlur({
                        color: theme.palette.grey[500],
                        opacity: 0.1,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        color: 'white',
                        backgroundColor: '#ee6a31',
                        borderRadius: '3px',
                        pl: 1,
                      }}
                    >
                      Date
                    </Box>
                    <DateDisplay date={trip.start_at} />
                  </Box>
                </Grid>
                <Grid md={2}>
                  <Box
                    sx={{
                      borderRadius: '3px',
                      p: 0.3,
                      height: '100%',
                      width: '100%',
                      ...bgBlur({
                        color: theme.palette.grey[500],
                        opacity: 0.1,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        color: 'white',
                        backgroundColor: '#ee6a31',
                        borderRadius: '3px',
                        pl: 1,
                      }}
                    >
                      Aircraft
                    </Box>
                    <Typography variant="body2" p={1}>
                      {sheet.aircraft.model.aircraft_model}
                    </Typography>
                  </Box>
                </Grid>
                <Grid md={4}>
                  <Box
                    sx={{
                      borderRadius: '3px',
                      p: 0.3,
                      height: '100%',
                      width: '100%',
                      ...bgBlur({
                        color: theme.palette.grey[500],
                        opacity: 0.1,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        color: 'white',
                        backgroundColor: '#ee6a31',
                        borderRadius: '3px',
                        pl: 1,
                      }}
                    >
                      Departure Airport
                    </Box>
                    <Box p={1}>
                      <Typography variant="body2">
                        {`${trip.departure_airport.airport_name} (${trip.departure_airport.icao_code})`}
                      </Typography>
                      <Typography variant="body2">
                        {`Address : ${
                          trip.departure_airport.address ? trip.departure_airport.address : ''
                        }`}
                      </Typography>
                      <Typography variant="body2">
                        {`Departure : ${new Date(trip.start_at).toLocaleTimeString('en-GB')} HRS`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid md={4}>
                  <Box
                    sx={{
                      borderRadius: '3px',
                      p: 0.3,
                      height: '100%',
                      width: '100%',
                      ...bgBlur({
                        color: theme.palette.grey[500],
                        opacity: 0.1,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        color: 'white',
                        backgroundColor: '#ee6a31',
                        borderRadius: '3px',
                        pl: 1,
                      }}
                    >
                      Arrival Airport
                    </Box>
                    <Box p={1}>
                      <Typography variant="body2">
                        {`${trip.arrival_airport.airport_name} (${trip.arrival_airport.icao_code})`}
                      </Typography>
                      <Typography variant="body2">
                        {`Address : ${
                          trip.arrival_airport.address ? trip.arrival_airport.address : ''
                        }`}
                      </Typography>
                      <Typography variant="body2">
                        {`Arrival : ${new Date(trip.end_at).toLocaleTimeString('en-GB')} HRS`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid> */}

              <Stack mb={2} gap={2} direction="row" justifyContent="space-between">
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    width: '100%',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Departure Airport
                    </Typography>
                  </Box>
                  <Box p={1}>
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                    >
                      <b>{`${trip.departure_airport.airport_name} (${trip.departure_airport.icao_code})`}</b>
                      <br />
                      <br />
                      <b>Address : </b>
                      {`${trip.departure_airport.address ? trip.departure_airport.address : ''}`}
                      <br />
                      <br />
                      <b>Departure : </b>
                      {`${new Date(trip.start_at).toLocaleTimeString('en-GB')} HRS`}
                    </Typography>
                    <Typography variant="body2" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    width: '100%',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Arrival Airport
                    </Typography>
                  </Box>
                  <Box p={1}>
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                    >
                      <b>{`${trip.arrival_airport.airport_name} (${trip.arrival_airport.icao_code})`}</b>
                      <br />
                      <br />
                      <b>Address : </b>
                      {`${trip.arrival_airport.address ? trip.arrival_airport.address : ''}`}
                      <br />
                      <br />
                      <b>Arrival : </b>
                      {`${new Date(trip.end_at).toLocaleTimeString('en-GB')} HRS`}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: '3px',
                    p: 0.3,
                    minWidth: '70mm',
                    ...bgBlur({
                      color: theme.palette.grey[500],
                      opacity: 0.1,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      backgroundColor: '#ee6a31',
                      borderRadius: '3px',
                      pl: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                      Ground Handler Details
                    </Typography>
                  </Box>
                  <Stack p={1} direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={theme.typography.fontWeightBold}
                        sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                      >
                        Departure Airport :
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                        {trip.gh_departure_airport}
                      </Typography>
                      <PhoneDisplay phone={trip.gh_departure_airport_phone} />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={theme.typography.fontWeightBold}
                        sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                      >
                        Arrival Airport :
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}>
                        {trip.gh_arrival_airport}
                      </Typography>
                      <PhoneDisplay phone={trip.gh_arrival_airport_phone} />
                    </Box>
                  </Stack>
                  {/* <Grid container spacing={3} p={1}>
                    <Grid md={6}>
                      <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                        Departure Airport
                      </Typography>
                      <Typography variant="body2">{trip.gh_departure_airport}</Typography>
                      <PhoneDisplay phone={trip.gh_departure_airport_phone} />
                    </Grid>
                    <Grid md={6}>
                      <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                        Arrival Airport
                      </Typography>
                      <Typography variant="body2">{trip.gh_arrival_airport}</Typography>
                      <PhoneDisplay phone={trip.gh_arrival_airport_phone} />
                    </Grid>
                  </Grid> */}
                </Box>
              </Stack>

              <Box
                sx={{
                  borderRadius: '3px',
                  p: 0.3,
                  mb: 2,
                  ...bgBlur({
                    color: theme.palette.grey[500],
                    opacity: 0.1,
                  }),
                }}
              >
                <Box
                  sx={{
                    color: 'white',
                    backgroundColor: '#ee6a31',
                    borderRadius: '3px',
                    pl: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                    Passenger List
                  </Typography>
                </Box>
                <Box p={1}>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                  >
                    {trip.passengers.map((pr, pr_index) => (
                      <>
                        {pr.name} &emsp;&emsp;
                        {(pr_index + 1) % 4 === 0 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </>
                    ))}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  borderRadius: '3px',
                  p: 0.3,
                  mb: 2,
                  ...bgBlur({
                    color: theme.palette.grey[500],
                    opacity: 0.1,
                  }),
                }}
              >
                <Box
                  sx={{
                    color: 'white',
                    backgroundColor: '#ee6a31',
                    borderRadius: '3px',
                    pl: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                    Crew List
                  </Typography>
                </Box>
                <Box p={1}>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                  >
                    {trip.crew.map((cr, cr_index) => (
                      <>
                        {cr.name} &emsp;&emsp;
                        {(cr_index + 1) % 4 === 0 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </>
                    ))}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  borderRadius: '3px',
                  p: 0.3,
                  mb: 2,
                  ...bgBlur({
                    color: theme.palette.grey[500],
                    opacity: 0.1,
                  }),
                }}
              >
                <Box
                  sx={{
                    color: 'white',
                    backgroundColor: '#ee6a31',
                    borderRadius: '3px',
                    pl: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={theme.typography.fontWeightBold}>
                    Passenger Facilitator
                  </Typography>
                </Box>
                <Box p={1}>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                  >
                    {(trip.passenger_facilitators || []).map((pf, pf_index) => (
                      <>
                        {pf.name} &emsp;&emsp;
                        {(pf_index + 1) % 4 === 0 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </>
                    ))}
                  </Typography>
                </Box>
              </Box>

              {index === sheet.trips.length - 1 && (
                <Box mt={5}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    fontWeight={theme.typography.fontWeightBold}
                    sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                  >
                    Best Regards,
                  </Typography>

                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ fontSize: '0.77rem', lineHeight: 1.2 }}
                  >
                    <b>{sheet.operation_manager}</b>
                    <br />
                    Operation Manager
                    <br />
                    Sparzana Aviation Pvt. Ltd.
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box component="p">Failed to load pdf..!</Box>
      )}
    </Box>
  );
}
