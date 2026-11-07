/* eslint-disable import/no-unresolved */
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Link, Stack, alpha, Divider, useTheme, Typography } from '@mui/material';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

const authToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY';

const formatDate = (isoString) => {
  const date = new Date(isoString);

  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  return formattedDate;
};

const formateTime = (isoString) => {
  const date = new Date(isoString);

  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  const timeString = date.toLocaleTimeString('en-IN', options);

  const formattedTime = timeString.replace(':', '');

  return formattedTime;
};

const formatePhone = (phone) => {
  const countryCode = '+91';
  const part1 = phone.slice(0, 5);
  const part2 = phone.slice(5);
  return `${countryCode} ${part1}${part2}`;
};

  const getPassengers = (arr) => {
    const middle = Math.ceil(arr.length / 2);
    const box_1 = [];
    const box_2 = [];
    for (let i = 0; i < middle; i += 1) {
      box_1.push(
        <>
          {`${i + 1}. ${arr[i].name}`}
          <br />
        </>
      );
    }
    for (let i = middle; i < arr.length; i += 1) {
      box_2.push(
        <>
          {`${i + 1}. ${arr[i].name}`}
          <br />
        </>
      );
    }
    const component = (
      <>
        <Box>{box_1}</Box>
        <Box>{box_2}</Box>
      </>
    );

    return component;
  };

const PhoneDisplay = ({ phone }) => {
  const formattedPhoneNumber = formatePhone(phone);
  return (
    <Link href={`tel:${phone}`} color="inherit">
      <Typography variant="body1" component="div">
        {phone}
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
  const [sheet, setSheet] = useState({
    aircraft: {
      model: { images: { interior_image_1: null, interior_image_2: null, interior_image_3: null } },
    },
    trips: [
      {
        departure_airport: {
          city: {
            city_name: '',
            zone:{
              gmt:""
            }
          },
        },
        arrival_airport: {
          city: {
            city_name: '',
          },
        },
        passengers: [],
        crew: [],
        passenger_facilitators: [],
        gh_departure_airport: '',
        gh_departure_airport_phone: '',
        gh_arrival_airport: '',
        gh_arrival_airport_phone: '',
        departure_address: '',
        arrival_address: '',
        start_at: null,
        end_at: null,
      },
    ],
  });

  const Interior = [
    sheet.aircraft.model.images.interior_image_1,
    sheet.aircraft.model.images.interior_image_2,
    sheet.aircraft.model.images.interior_image_3,
  ];

  console.log(sheet);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/pdf_data/brief_sheet/${sheetId}`, { headers: { Authorization: authToken } })
        .then((res) => {
          setSheet(res.data.results);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// function convertUTCToGMTOffsetTime(utcTime, gmtOffset) {
//   if (!utcTime || !gmtOffset) return null;
//   formated(utcTime,gmtOffset)
//   console.log("utctime", utcTime)
//   const utcDate = new Date(utcTime);
//   if (isNaN(utcDate.getTime())) {
//     console.error("Invalid UTC time:", utcTime);
//     return null;
//   }

//   const [sign, hh, mm, ss] = "+05:30:00".match(/([+-]?)(\d{2}):(\d{2}):(\d{2})/).slice(1);
//   const hours = Number(hh);
//   const minutes = Number(mm);
//   const totalOffsetMs = (hours * 60 + minutes) * 60 * 1000;
//   const offsetMs = sign === '-' ? -totalOffsetMs : totalOffsetMs;

//   const localTime = new Date(utcDate.getTime() + offsetMs);
//    console.log("localTime",localTime)
//   return localTime;
// }
function convertUTCToGMTOffsetTime(utcTime, gmtOffset) {
  if (!utcTime || !gmtOffset) return null;

  const utcDate = new Date(utcTime);
  if (Number.isNaN(utcDate.getTime())) {
    console.error("Invalid UTC time:", utcTime);
    return null;
  }

  const [sign, hh, mm, ss] = gmtOffset.match(/([+-]?)(\d{2}):(\d{2}):(\d{2})/).slice(1);
  const hours = Number(hh);
  const minutes = Number(mm);
  const totalOffsetMs = (hours * 60 + minutes) * 60 * 1000;
  const offsetMs = sign === '-' ? -totalOffsetMs : totalOffsetMs;

  const localTime = new Date(utcDate.getTime() + offsetMs);

  // Use UTC getters to avoid system time conversion
  const formatted =
    `${localTime.getUTCHours().toString().padStart(2, '0')}${localTime.getUTCMinutes().toString().padStart(2, '0')}`;
  
     console.log("gmtOffset", formatted)
  return formatted;
}




const TimeZone = (trip) => {
  const { arrival_airport, departure_airport, start_at, end_at } = trip;
  const sameZone = arrival_airport?.city?.zone_id === departure_airport?.city?.zone_id;
  const depCity = departure_airport?.city;
  const arrCity = arrival_airport?.city;

  if (sameZone) {
    const timeFormat = depCity?.country?.time_formate || 'IST';
    return (
      <Typography variant="body1" component="div">
        {`(ETD ${formateTime(start_at)} ${timeFormat}) `}
        <b>{depCity?.city_name} --- {arrCity?.city_name}</b>{' '}
        {`(ETA ${formateTime(end_at)} ${timeFormat})`}
      </Typography>
    );
  }

   console.log("arrCity",arrCity)
   console.log("arrCity",depCity)

   const gmtZones = arrCity?.country?.time_formate === "IST" ? depCity?.zone?.gmt :arrCity?.zone?.gmt
  // Different zones: Convert UTC to arrival zone's GMT offset
  const arrivalTime = convertUTCToGMTOffsetTime(end_at, gmtZones);
  const departureTime = convertUTCToGMTOffsetTime(start_at, gmtZones);
  const arrTimeFormat = arrCity?.country?.time_formate === "IST" ? depCity?.country?.time_formate :arrCity?.country?.time_formate;
  console.log("arrTimeFormat",arrTimeFormat)
  return (
    <>
      <Typography variant="body1" component="div">
        {`(ETD ${formateTime(start_at)} IST) `}
        <b>{depCity?.city_name} --- {arrCity?.city_name}</b>{' '}
        {`(ETA ${formateTime(end_at)} IST)`}
      </Typography>

      <Typography variant="body1" component="div">
        {`(ETD ${departureTime} ${arrTimeFormat}) `}
        <b>{depCity?.city_name} --- {arrCity?.city_name}</b>{' '}
        {`(ETA ${arrivalTime} ${arrTimeFormat})`}
      </Typography>
    </>
  );
};

const ReportingTime = (trip) => {
  const { arrival_airport, departure_airport } = trip;
   console.log("arrival_airport",arrival_airport)
    console.log("departure_airport",departure_airport)

     if (
  arrival_airport?.city?.country?.time_formate !== "IST" || 
  departure_airport?.city?.country?.time_formate !== "IST"
) {
  return "1 hr 15";
}
    return "30";

 // International
};

  return (
    <Stack justifyContent="center" alignItems="center">
      {sheet ? (
        <>
          {/* First Page  */}
          <Box
            sx={{
              width: '210mm',
              height: '297mm',
              // p: '10mm',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              // border: '0.1px dotted',
              backgroundColor: '#ffffff',
            }}
          >
            <Stack
              direction="row"
              p="20mm"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderWidth: '2px', // Adjust thickness
                    borderColor: 'black', // Replace 'red' with your desired color
                    borderStyle: 'solid', // Ensure it's a solid line
                  }}
                />
              }
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  component="img"
                  src="/assets/logo/Refex-Logo.png"
                  alt="refex-logo"
                  height={35}
                />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo sx={{ width: 90, height: 75 }} />
              </Box>
            </Stack>

            {/* <Stack
              py="20mm"
              px="10mm"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            > */}
            <Typography
              variant="h3"
              fontWeight={theme.typography.fontWeightBold}
              sx={{
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.4rem',
              }}
            >
              BRIEF SHEET
            </Typography>
            <Typography
              variant="body2"
              fontWeight={theme.typography.fontWeightBold}
              sx={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2rem' }}
            >
              {formatDate(sheet.trips[0].start_at)}
              <br />
              {sheet.trips[0].departure_airport.city.city_name}
              {sheet.trips.map((trip) => ` - ${trip.arrival_airport.city.city_name}`)}
            </Typography>
            {/* </Stack> */}

            <Box py="20mm">
              <Box
                sx={{
                  position: 'relative',
                  // width: '190mm',
                  height: '100mm',
                  // filter: 'grayscale(100%)',
                  borderTop: '5px solid black', // Top border
                  borderRight: 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '5px', // Thickness of the right border
                    height: '50%', // Half of the height of the Box
                    backgroundColor: 'black', // Color of the border
                  },
                  ...bgGradient({
                    color: alpha(theme.palette.grey[100], 0.0),
                    imgUrl: `/uploads/aircrafts/${sheet.aircraft.model.images.aircraft_image_1}`,
                  }),
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: '4mm', // Position the text to the right of the Box
                    top: '4mm',
                    height: '100%', // Full height of the Box
                    // display: 'flex',
                    // alignItems: 'center', // Vertically center the text
                    // fontWeight: theme.typography.fontWeightBold, // Optional: Set text weight
                  }}
                >
                  <Stack direction="column">
                    <Typography
                      variant="body1"
                      sx={{
                        // fontSize: '0.77rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1rem',
                      }}
                      fontWeight={theme.typography.fontWeightBold}
                    >
                      UPTO: 05:30 HRS
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={theme.typography.fontWeightBold}
                      sx={{
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1rem',
                      }}
                    >
                      Endurance
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={theme.typography.fontWeightBold}
                      sx={{
                        letterSpacing: '0.1rem',
                      }}
                    >
                      6000 kms
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              {/* <Box
                component="img"
                height="100mm"
                src={`http://localhost:3001/uploads/aircrafts/${sheet.aircraft.model.images.aircraft_image_1}`}
              /> */}
              <Stack direction="row" px="3mm" justifyContent="flex-end" alignItems="center">
                <Typography
                  variant="h5"
                  fontWeight={theme.typography.fontWeightLight}
                  sx={{
                    fontSize: '0.77rem',
                    lineHeight: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3rem',
                  }}
                >
                  {sheet.aircraft.model.aircraft_model} CALL SIGN {sheet.aircraft.reg_no}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* From second page */}
          {sheet.trips.map((trip, index) => (
            <Box
              key={index}
              sx={{
                width: '210mm',
                height: '297mm',
                pt: '10mm',
                boxSizing: 'border-box',
                pageBreakAfter: 'always',
                // border: '0.1px dotted',
                backgroundColor: '#ffffff',
              }}
            >
              {/* Header */}
              <Stack
                mb={3}
                px="10mm"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  component="img"
                  src="/assets/logo/Refex-Logo.png"
                  alt="refex-logo"
                  height={35}
                />
                <Logo sx={{ width: 90, height: 75 }} />
              </Stack>

              <Box px="10mm">
                <Box
                  sx={{
                    position: 'relative',
                    height: '30mm',
                    textTransform: 'uppercase',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    letterSpacing: '0.2rem',
                    color: '#5e3a17',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '50%', // Half the width of the box for the top border
                      height: '5px', // Thickness of the top border
                      backgroundColor: 'black',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '5px', // Thickness of the left border
                      height: '85%', // Half the height of the box for the left border
                      backgroundColor: 'black',
                    },
                  }}
                >
                  <Typography variant="h6" component="div">
                    {sheet.aircraft.reg_no} FLIGHT BRIEF SHEET
                  </Typography>
                  <Typography variant="body1" component="div">
                    <b>{formatDate(trip.start_at)}</b>
                  </Typography>
                    {TimeZone(trip)}
                </Box>
              </Box>

              <Box px="10mm" pb="10mm" height="150.5mm">
                <Box
                  sx={{
                    position: 'relative',
                    height: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '50%', // Half the width of the box for the bottom border
                      height: '5px', // Thickness of the bottom border
                      backgroundColor: 'black',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '5px', // Thickness of the right border
                      height: '18%', // Half the height of the box for the right border
                      backgroundColor: 'black',
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: '20mm',
                      pb: '3px',
                      ...bgGradient({
                        startColor: '#b0a386',
                        endColor: '#b0a386',
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        border: '5px solid #F9FAFB',
                        // borderLeft: '5px solid white',
                        // borderBottom: '5px solid white',
                        ...bgGradient({
                          color: alpha(theme.palette.grey[200], 0.9),
                          imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
                        }),
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        textAlign="center"
                        pt={1}
                        sx={{
                          letterSpacing: '0.15rem',
                        }}
                      >
                        <b>Passenger List:</b>
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={5}
                        justifyContent="center"
                        // alignItems="center"
                      >
                        {trip.passengers.length < 7 ? (
                          <Box height="38.1mm">
                            <Typography
                              variant="body1"
                              component="div"
                              sx={{
                                letterSpacing: '0.1rem',
                                lineHeight: '1.3rem',
                              }}
                            >
                              {trip.passengers
                              .map((pr, pr_index) => (
                                <>
                                  {`${pr_index + 1}. ${pr.name}`}
                                  <br />
                                </>
                              ))}
                            </Typography>
                          </Box>
                        ) : (
                          getPassengers(trip.passengers)
                        )}
                      </Stack>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    p={3}
                    sx={{
                      letterSpacing: '0.15rem',
                      lineHeight: '1.3rem',
                      color: '#5e3a17',
                      textAlign: 'center',
                      gap: '10mm',
                    }}
                  >
                    <Box sx={{ width: '33%' }}>
                      <Typography variant="body1" component="div">
                        <b>
                          CREW :
                          <br />
                          {trip.crew.map((cr) => (
                            <>
                              {`${cr.name}`}
                              <br />
                            </>
                          ))}
                        </b>
                      </Typography>
                    </Box>
                    <Box sx={{ width: '33%' }}>
                      <Typography variant="body1" component="div">
                        <b>
                          PASSENGER FACILITATOR :
                          <br />
                          {(trip.passenger_facilitators || []).map((pf) => (
                            <>
                              {`${pf.name}`}
                              <br />
                            </>
                          ))}
                        </b>
                      </Typography>
                    </Box>
                    <Box sx={{ width: '33%' }}>
                      <Typography variant="body1" component="div">
                        <b>
                          SOD DETAILS :
                          <br />
                          {trip.departure_airport.city.city_name} : {trip.gh_departure_airport}
                        </b>
                        <PhoneDisplay phone={trip.gh_departure_airport_phone} />
                        <b>
                          {trip.arrival_airport.city.city_name} : {trip.gh_arrival_airport}
                        </b>
                        <PhoneDisplay phone={trip.gh_arrival_airport_phone} />
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      letterSpacing: '0.15rem',
                      lineHeight: '1.3rem',
                      color: '#5e3a17',
                      textAlign: 'center',
                    }}
                  >
                    <b>{`Reporting time ${ReportingTime(trip)}  Mins prior to the departure`}</b>
                    <br />
                    <b>Departure:</b> {trip.departure_address}
                    <br />
                    <b>Arrival:</b> {trip.arrival_address}
                    <br />
                  </Typography>
                </Box>
              </Box>

              <Stack
                direction="row"
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="80mm"
                spacing="2mm"
              >
                {Interior.map(
                  (img, ind) =>
                    img && (
                      <Box
                        key={ind}
                        component="img"
                        src={`/uploads/interiors/${img}`} // Add the source to the img component
                        width="70mm"
                        height={1}
                        // sx={{
                        //   filter: 'grayscale(100%)',
                        // }}
                      />
                    )
                )}
              </Stack>
            </Box>
          ))}
        </>
      ) : (
        <Box component="p">Failed to load pdf..!</Box>
      )}
    </Stack>
  );
}
