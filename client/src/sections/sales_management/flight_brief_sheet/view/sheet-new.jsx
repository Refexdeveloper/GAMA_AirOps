import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Link,
  Card,
  Stack,
  Slide,
  Dialog,
  Button,
  Divider,
  Tooltip,
  Container,
  TextField,
  Typography,
  IconButton,
  Breadcrumbs,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function NewPage() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [sheetNo, setSheetNo] = useState('SAPL/FBS-0000');
  const [sheet, setSheet] = useState({
    customer_name: '',
    aircraft_id: null,
    flight_manager: '',
    flight_manager_phone: '',
    operation_manager: '',
    operation_manager_phone: '',
    trips: [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        gh_departure_airport: '',
        gh_departure_airport_phone: '',
        gh_arrival_airport: '',
        gh_arrival_airport_phone: '',
        passengers: [
          {
            name: '',
          },
        ],
        passenger_facilitators: [
          {
            name: '',
          },
        ],
        crew: [
          {
            name: '',
            phone: '',
          },
        ],
        start_at: null,
        end_at: null,
        departure_address: '',
        arrival_address: '',
      },
    ],
  });
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/brief_sheet/next_number')
        .then((res) => setSheetNo(res.data))
        .catch((error) => setSheetNo('SAPL/FBS-0000'));

      await axios
        .get('/api/all_aircrafts')
        .then((res) => setAircrafts(res.data.results))
        .catch((error) => {
          setAircrafts([]);
        });

      await axios
        .get('/api/airports')
        .then((response) => {
          setAirports(response.data);
        })
        .catch((error) => {
          setAirports([]);
        });
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setSheet((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const handleChangeAircraft = (value) => {
    setSheet((pre) => ({ ...pre, ...{ aircraft_id: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const handleInputChangeTrips = (index, field, value) => {
    const newTrips = [...sheet.trips];
    newTrips[index][field] = value;
    setSheet((pre) => ({ ...pre, ...{ trips: newTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const handleInputChangePassengers = (trip_index, pr_index, field, value) => {
    const updatedPassengers = [...sheet.trips[trip_index].passengers];
    updatedPassengers[pr_index][field] = value;
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passengers = updatedPassengers;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const handleInputChangeCrew = (trip_index, cr_index, field, value) => {
    const updatedCrew = [...sheet.trips[trip_index].crew];
    updatedCrew[cr_index][field] = value;
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].crew = updatedCrew;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const handleInputChangePassengerFacilitators = (trip_index, pf_index, field, value) => {
    const updated = [...(sheet.trips[trip_index].passenger_facilitators || [])];
    updated[pf_index][field] = value;
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passenger_facilitators = updated;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const addTrip = () => {
    const updatedTrips = [
      ...sheet.trips,
      ...[
        {
          departure_airport_id: null,
          arrival_airport_id: null,
          gh_departure_airport: '',
          gh_departure_airport_phone: '',
          gh_arrival_airport: '',
          gh_arrival_airport_phone: '',
          passengers: [
            {
              name: '',
            },
          ],
          passenger_facilitators: [
            {
              name: '',
            },
          ],
          crew: [
            {
              name: '',
              phone: '',
            },
          ],
          start_at: null,
          end_at: null,
          departure_address: '',
          arrival_address: '',
        },
      ],
    ];
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removeTrip = (index) => {
    const updatedTrips = sheet.trips.filter((_t, i) => i !== index);
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removeAllTrips = () => {
    const updatedTrips = [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        gh_departure_airport: '',
        gh_departure_airport_phone: '',
        gh_arrival_airport: '',
        gh_arrival_airport_phone: '',
        passengers: [
          {
            name: '',
          },
        ],
        passenger_facilitators: [
          {
            name: '',
          },
        ],
        crew: [
          {
            name: '',
            phone: '',
          },
        ],
        start_at: null,
        end_at: null,
        departure_address: '',
        arrival_address: '',
      },
    ];
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const addPassenger = (trip_index) => {
    const updatedPassengers = [
      ...sheet.trips[trip_index].passengers,
      ...[
        {
          name: '',
        },
      ],
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passengers = updatedPassengers;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removePassenger = (trip_index, pr_index) => {
    const updatedPassengers = sheet.trips[trip_index].passengers.filter((_p, i) => i !== pr_index);
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passengers = updatedPassengers;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removeAllPassengers = (trip_index) => {
    const updatedPassengers = [
      {
        name: '',
      },
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passengers = updatedPassengers;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const addPassengerFacilitator = (trip_index) => {
    const updated = [
      ...(sheet.trips[trip_index].passenger_facilitators || []),
      ...[
        {
          name: '',
        },
      ],
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passenger_facilitators = updated;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const removePassengerFacilitator = (trip_index, pf_index) => {
    const updated = (sheet.trips[trip_index].passenger_facilitators || []).filter(
      (_p, i) => i !== pf_index
    );
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passenger_facilitators = updated;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const removeAllPassengerFacilitators = (trip_index) => {
    const updated = [
      {
        name: '',
      },
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].passenger_facilitators = updated;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const addCrew = (trip_index) => {
    const updatedCrew = [
      ...sheet.trips[trip_index].crew,
      ...[
        {
          name: '',
          phone: '',
        },
      ],
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].crew = updatedCrew;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removeCrew = (trip_index, cr_index) => {
    const updatedCrew = sheet.trips[trip_index].crew.filter((_c, i) => i !== cr_index);
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].crew = updatedCrew;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };
  const removeAllCrew = (trip_index) => {
    const updatedCrew = [
      {
        name: '',
        phone: '',
      },
    ];
    const updatedTrips = [...sheet.trips];
    updatedTrips[trip_index].crew = updatedCrew;
    setSheet((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const validateData = () => {
    const errors = {};
    if (!sheet.customer_name) errors.customer_name = 'Customer Name is required';
    if (!sheet.aircraft_id) errors.aircraft_id = 'Please select the aircraft';
    if (!sheet.flight_manager) errors.flight_manager = 'Flight Manager is required';
    if (!sheet.flight_manager_phone) errors.flight_manager_phone = 'Phone is required';
    if (!sheet.operation_manager) errors.operation_manager = 'Operation Manager is required';
    if (!sheet.operation_manager_phone) errors.operation_manager_phone = 'Phone is required';
    // eslint-disable-next-line array-callback-return
    sheet.trips.map((trip, index) => {
      if (trip.departure_airport_id === trip.arrival_airport_id) {
        errors[`departure_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
        errors[`arrival_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
      }
      if (!trip.departure_airport_id)
        errors[`departure_airport_id_${index}`] = 'Departure Airport is required';
      if (!trip.arrival_airport_id)
        errors[`arrival_airport_id_${index}`] = 'Arrival Airport is required';
      if (!trip.start_at) errors[`start_at_${index}`] = 'Date & Time is required';
      if (!trip.end_at) errors[`end_at_${index}`] = 'Date & Time is required';
      if (!trip.gh_departure_airport)
        errors[`gh_departure_airport_${index}`] = 'Ground Handler is required';
      if (!trip.gh_departure_airport_phone)
        errors[`gh_departure_airport_phone_${index}`] = 'Phone is required';
      if (!trip.gh_arrival_airport)
        errors[`gh_arrival_airport_${index}`] = 'Ground Handler is required';
      if (!trip.gh_arrival_airport_phone)
        errors[`gh_arrival_airport_phone_${index}`] = 'Phone is required';
      // eslint-disable-next-line array-callback-return
      trip.passengers.map((pax, p_index) => {
        if (!pax.name) errors[`passengers_name_${index}_${p_index}`] = 'Passenger Name is required';
      });
      // eslint-disable-next-line array-callback-return
      trip.crew.map((cr, c_index) => {
        if (!cr.name) errors[`crew_name_${index}_${c_index}`] = 'Crew Name is required';
      });
    });
    return errors;
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }
    try {
      await axios
        .post('/api/brief_sheet', sheet)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/sales_management/flight_brief_sheet/list');
            enqueueSnackbar(response.data.message, {
              variant: response.data.status ? 'success' : 'error',
              action,
            });
          }
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
            enqueueSnackbar(error.response.data.message, { variant: 'error', action });
          }, 3000);
        });
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        enqueueSnackbar(error.message, { variant: 'error', action });
      }, 3000);
    }
  };

  const handleClickAlert = () => {
    setOpenAlert(!openAlert);
  };

  const breadcrumbs = [
    <Link key="1" underline="hover" color="inherit" href="/sales_management">
      Sales&nbsp;Management
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Link key="2" underline="hover" color="inherit" href="/sales_management/flight_brief_sheet">
      Flight&nbsp;Brief&nbsp;Sheet
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;Sheet
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Create&nbsp;a&nbsp;new&nbsp;flight&nbsp;brief&nbsp;sheet
          </Typography>
          <Breadcrumbs
            separator={<Iconify icon="eva:chevron-right-fill" />}
            aria-label="breadcrumb"
            sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Box>
        {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => router.push('/admin/user/new')}
          >
            New&nbsp;User
          </Button> */}
      </Stack>

      <Card sx={{ overflow: 'visible' }}>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          <Box p={3}>
            <Typography component="div" variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Booking Details :
            </Typography>
            <Grid container direction="row" spacing={2} mb={2}>
              <Grid xs={12} sm={6} md={3}>
                <TextField disabled fullWidth size="small" label="Sheet No" value={sheetNo} />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    disabled
                    fullWidth
                    size="small"
                    label="Date Created"
                    defaultValue={dayjs(new Date())}
                    format="DD / MM / YYYY"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={false} sm={6} md={6} />
            </Grid>
            <Grid container direction="row" spacing={2}>
              <Grid xs={12} sm={6} md={3}>
                <TextField
                  required
                  fullWidth
                  id="customer_name"
                  label="Customer Name"
                  size="small"
                  value={sheet.customer_name}
                  error={Boolean(validationErrors.customer_name)}
                  helperText={validationErrors.customer_name}
                  onChange={(event, value) =>
                    handleInputChange('customer_name', event.target.value)
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Autocomplete
                  id="aircraft_id"
                  size="small"
                  getOptionLabel={(option) => `${option.model.aircraft_model} (${option.reg_no})`}
                  value={aircrafts.find((_air) => _air.id === sheet.aircraft_id) || null}
                  onChange={(event, value) => {
                    if (value) handleChangeAircraft(value.id);
                    else handleChangeAircraft(null);
                  }}
                  options={aircrafts}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Aircraft"
                      error={Boolean(validationErrors.aircraft_id)}
                      helperText={validationErrors.aircraft_id}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={12} md={6}>
                <Stack
                  display="flex"
                  direction={{ xs: 'column', sm: 'row' }}
                  gap={{ xs: 1, sm: 2 }}
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Stack gap={1} width={1}>
                    <TextField
                      required
                      fullWidth
                      id="flight_manager"
                      label="Flight Manager"
                      size="small"
                      value={sheet.flight_manager}
                      error={Boolean(validationErrors.flight_manager)}
                      helperText={validationErrors.flight_manager}
                      onChange={(event) => handleInputChange('flight_manager', event.target.value)}
                    />

                    <TextField
                      required
                      fullWidth
                      id="flight_manager_phone"
                      label="Phone"
                      size="small"
                      inputProps={{
                        inputMode: 'tel',
                        pattern: '^[+\\d][\\d\\s()-]*\\d$',
                      }}
                      value={sheet.flight_manager_phone}
                      error={Boolean(validationErrors.flight_manager_phone)}
                      helperText={validationErrors.flight_manager_phone}
                      onChange={(event) => {
                        const { value } = event.target;
                        if (/^\+?[\d\s\-()]{0,20}$/.test(value)) {
                          handleInputChange('flight_manager_phone', value);
                        }
                      }}
                    />
                  </Stack>
                  <Stack gap={1} width={1}>
                    <TextField
                      required
                      fullWidth
                      id="operation_manager"
                      label="Operation Manager"
                      size="small"
                      value={sheet.operation_manager}
                      error={Boolean(validationErrors.operation_manager)}
                      helperText={validationErrors.operation_manager}
                      onChange={(event, value) =>
                        handleInputChange('operation_manager', event.target.value)
                      }
                    />

                    <TextField
                      required
                      fullWidth
                      id="operation_manager_phone"
                      label="Phone"
                      size="small"
                      inputProps={{
                        inputMode: 'tel',
                        pattern: '^[+\\d][\\d\\s()-]*\\d$',
                      }}
                      value={sheet.operation_manager_phone}
                      error={Boolean(validationErrors.operation_manager_phone)}
                      helperText={validationErrors.operation_manager_phone}
                      onChange={(event) => {
                        const { value } = event.target;
                        if (/^\+?[\d\s\-()]{0,20}$/.test(value)) {
                          handleInputChange('operation_manager_phone', value);
                        }
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Box p={3}>
            <Typography component="div" variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Flight Details :
            </Typography>
            {sheet.trips.map((trip, index) => (
              <Box key={index} mt={2}>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Trip {index + 1}</Typography>
                  {index === 0 && sheet.trips.length > 1 && (
                    <Button
                      // variant="contained"
                      color="error"
                      onClick={removeAllTrips}
                      style={{ textTransform: 'none' }}
                      startIcon={<Iconify icon="eva:close-fill" />}
                    >
                      Remove All
                    </Button>
                  )}
                  {index !== 0 && (
                    <Button
                      // variant="contained"
                      color="error"
                      onClick={() => removeTrip(index)}
                      style={{ textTransform: 'none' }}
                      startIcon={<Iconify icon="eva:minus-fill" />}
                    >
                      Remove Trip
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2} mb={1}>
                  <Grid xs={12} sm={6} md={3}>
                    <Autocomplete
                      id="departure_airport"
                      fullWidth
                      size="small"
                      value={
                        airports.find((_a) => _a.airport_id === trip.departure_airport_id) || null
                      }
                      onChange={(event, value) => {
                        if (value)
                          handleInputChangeTrips(index, 'departure_airport_id', value.airport_id);
                        else handleInputChangeTrips(index, 'departure_airport_id', null);
                      }}
                      options={airports}
                      getOptionLabel={(option) => option.airport_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Departure Airport"
                          error={Boolean(validationErrors[`departure_airport_id_${index}`])}
                          helperText={validationErrors[`departure_airport_id_${index}`]}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Departure Date & Time"
                        format="DD/MM/YYYY HH:mm"
                        ampm={false}
                        value={trip.start_at}
                        onChange={(newValue) => handleInputChangeTrips(index, 'start_at', newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            size: 'small',
                            error: Boolean(validationErrors[`start_at_${index}`]),
                            helperText: validationErrors[`start_at_${index}`],
                          },
                        }}
                        // viewRenderers={{
                        //   hours: renderTimeViewClock,
                        //   minutes: renderTimeViewClock,
                        //   seconds: renderTimeViewClock,
                        // }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <TextField
                      label="Gate No./Terminal/Address"
                      fullWidth
                      multiline
                      rows={2.5}
                      value={trip.departure_address}
                      error={Boolean(validationErrors[`departure_address_${index}`])}
                      helperText={validationErrors[`departure_address_${index}`]}
                      onChange={(event, value) =>
                        handleInputChangeTrips(index, 'departure_address', event.target.value)
                      }
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Stack gap={1} width={1}>
                      <TextField
                        required
                        fullWidth
                        id="gh_departure_airport"
                        label="Ground Handler Departure"
                        size="small"
                        value={trip.gh_departure_airport}
                        error={Boolean(validationErrors[`gh_departure_airport_${index}`])}
                        helperText={validationErrors[`gh_departure_airport_${index}`]}
                        onChange={(event, value) =>
                          handleInputChangeTrips(index, 'gh_departure_airport', event.target.value)
                        }
                      />
                      <TextField
                        required
                        fullWidth
                        id="gh_departure_airport_phone"
                        label="Phone"
                        size="small"
                        inputProps={{
                          inputMode: 'tel',
                          pattern: '^[+\\d][\\d\\s()-]*\\d$',
                        }}
                        value={trip.gh_departure_airport_phone}
                        error={Boolean(validationErrors[`gh_departure_airport_phone_${index}`])}
                        helperText={validationErrors[`gh_departure_airport_phone_${index}`]}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\+?[\d\s\-()]{0,20}$/.test(value)) {
                            handleInputChangeTrips(index, 'gh_departure_airport_phone', value);
                          }
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Autocomplete
                      id="arrival_airport"
                      fullWidth
                      size="small"
                      value={
                        airports.find((_a) => _a.airport_id === trip.arrival_airport_id) || null
                      }
                      onChange={(event, value) => {
                        if (value)
                          handleInputChangeTrips(index, 'arrival_airport_id', value.airport_id);
                        else handleInputChangeTrips(index, 'arrival_airport_id', null);
                      }}
                      options={airports}
                      getOptionLabel={(option) => option.airport_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Arrival Airport"
                          error={Boolean(validationErrors[`arrival_airport_id_${index}`])}
                          helperText={validationErrors[`arrival_airport_id_${index}`]}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Arrival Date & Time"
                        format="DD/MM/YYYY HH:mm"
                        ampm={false}
                        value={trip.end_at}
                        onChange={(newValue) => {
                          if (newValue) handleInputChangeTrips(index, 'end_at', newValue);
                          else handleInputChangeTrips(index, 'end_at', null);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            size: 'small',
                            error: Boolean(validationErrors[`end_at_${index}`]),
                            helperText: validationErrors[`end_at_${index}`],
                          },
                        }}
                        // viewRenderers={{
                        //   hours: renderTimeViewClock,
                        //   minutes: renderTimeViewClock,
                        //   seconds: renderTimeViewClock,
                        // }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <TextField
                      label="Gate No./Terminal/Address"
                      fullWidth
                      multiline
                      rows={2.5}
                      value={trip.arrival_address}
                      error={Boolean(validationErrors[`arrival_address_${index}`])}
                      helperText={validationErrors[`arrival_address_${index}`]}
                      onChange={(event, value) =>
                        handleInputChangeTrips(index, 'arrival_address', event.target.value)
                      }
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Stack gap={1} width={1}>
                      <TextField
                        required
                        fullWidth
                        id="gh_arrival_airport"
                        label="Ground Handler Arrival"
                        size="small"
                        value={trip.gh_arrival_airport}
                        error={Boolean(validationErrors[`gh_arrival_airport_${index}`])}
                        helperText={validationErrors[`gh_arrival_airport_${index}`]}
                        onChange={(event, value) =>
                          handleInputChangeTrips(index, 'gh_arrival_airport', event.target.value)
                        }
                      />
                      <TextField
                        required
                        fullWidth
                        id="gh_arrival_airport_phone"
                        label="Phone"
                        size="small"
                        inputProps={{
                          inputMode: 'tel',
                          pattern: '^[+\\d][\\d\\s()-]*\\d$',
                        }}
                        value={trip.gh_arrival_airport_phone}
                        error={Boolean(validationErrors[`gh_arrival_airport_phone_${index}`])}
                        helperText={validationErrors[`gh_arrival_airport_phone_${index}`]}
                        onChange={(event) => {
                          const { value } = event.target;
                          if (/^\+?[\d\s\-()]{0,20}$/.test(value)) {
                            handleInputChangeTrips(index, 'gh_arrival_airport_phone', value);
                          }
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    <Box>
                      <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1">Passengers</Typography>
                      </Box>
                      <Grid container spacing={3}>
                        {trip.passengers.map((pr, pr_index) => (
                          <>
                            <Grid xs={10} sm={10} md={10}>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                {pr_index + 1}.&nbsp;&nbsp;
                                <TextField
                                  required
                                  fullWidth
                                  id="passenger_name"
                                  label="Name"
                                  size="small"
                                  value={pr.name}
                                  error={Boolean(
                                    validationErrors[`passengers_name_${index}_${pr_index}`]
                                  )}
                                  helperText={
                                    validationErrors[`passengers_name_${index}_${pr_index}`]
                                  }
                                  onChange={(event, value) =>
                                    handleInputChangePassengers(
                                      index,
                                      pr_index,
                                      'name',
                                      event.target.value
                                    )
                                  }
                                />
                              </Box>
                            </Grid>
                            <Grid xs={2} sm={2} md={2}>
                              <Stack
                                spacing={1}
                                direction="row"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                {pr_index === 0 && trip.passengers.length > 1 && (
                                  <Tooltip title="Remove All" placement="bottom">
                                    <IconButton
                                      color="error"
                                      onClick={() => removeAllPassengers(index)}
                                    >
                                      <Iconify icon="eva:close-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {pr_index !== 0 && (
                                  <Tooltip title="Remove" placement="bottom">
                                    <IconButton
                                      color="error"
                                      onClick={() => removePassenger(index, pr_index)}
                                    >
                                      <Iconify icon="eva:minus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {pr_index === trip.passengers.length - 1 && (
                                  <Tooltip title="Add Crew" placement="bottom">
                                    <IconButton color="primary" onClick={() => addPassenger(index)}>
                                      <Iconify icon="eva:plus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    <Box>
                      <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1">Crew</Typography>
                      </Box>
                      <Grid container spacing={3}>
                        {trip.crew.map((cr, cr_index) => (
                          <>
                            <Grid xs={10} sm={10} md={10}>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                {cr_index + 1}.&nbsp;&nbsp;
                                <TextField
                                  required
                                  fullWidth
                                  id="crew_name"
                                  label="Name"
                                  size="small"
                                  value={cr.name}
                                  error={Boolean(
                                    validationErrors[`crew_name_${index}_${cr_index}`]
                                  )}
                                  helperText={validationErrors[`crew_name_${index}_${cr_index}`]}
                                  onChange={(event, value) =>
                                    handleInputChangeCrew(
                                      index,
                                      cr_index,
                                      'name',
                                      event.target.value
                                    )
                                  }
                                />
                              </Box>
                            </Grid>
                            {/* <Grid xs={5} sm={5} md={5}>
                              <TextField
                                required
                                fullWidth
                                id="crew_phone"
                                label="Phone"
                                size="small"
                                value={cr.phone}
                                error={Boolean(validationErrors[`crew_phone_${index}`])}
                                helperText={validationErrors[`crew_phone${index}`]}
                                onChange={(event, value) =>
                                  handleInputChangeCrew(
                                    index,
                                    cr_index,
                                    'phone',
                                    event.target.value
                                  )
                                }
                              />
                            </Grid> */}
                            <Grid xs={2} sm={2} md={2}>
                              <Stack
                                spacing={1}
                                direction="row"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                {cr_index === 0 && trip.crew.length > 1 && (
                                  <Tooltip title="Remove All" placement="bottom">
                                    <IconButton color="error" onClick={() => removeAllCrew(index)}>
                                      <Iconify icon="eva:close-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {cr_index !== 0 && (
                                  <Tooltip title="Remove" placement="bottom">
                                    <IconButton
                                      color="error"
                                      onClick={() => removeCrew(index, cr_index)}
                                    >
                                      <Iconify icon="eva:minus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {cr_index === trip.crew.length - 1 && (
                                  <Tooltip title="Add Crew" placement="bottom">
                                    <IconButton color="primary" onClick={() => addCrew(index)}>
                                      <Iconify icon="eva:plus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    <Box>
                      <Box mb={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1">Passenger Facilitator</Typography>
                      </Box>
                      <Grid container spacing={3}>
                        {(trip.passenger_facilitators || []).map((pf, pf_index) => (
                          <>
                            <Grid xs={10} sm={10} md={10}>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                {pf_index + 1}.&nbsp;&nbsp;
                                <TextField
                                  fullWidth
                                  id="passenger_facilitator_name"
                                  label="Name"
                                  size="small"
                                  value={pf.name}
                                  onChange={(event) =>
                                    handleInputChangePassengerFacilitators(
                                      index,
                                      pf_index,
                                      'name',
                                      event.target.value
                                    )
                                  }
                                />
                              </Box>
                            </Grid>
                            <Grid xs={2} sm={2} md={2}>
                              <Stack
                                spacing={1}
                                direction="row"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                {pf_index === 0 && (trip.passenger_facilitators || []).length > 1 && (
                                  <Tooltip title="Remove All" placement="bottom">
                                    <IconButton
                                      color="error"
                                      onClick={() => removeAllPassengerFacilitators(index)}
                                    >
                                      <Iconify icon="eva:close-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {pf_index !== 0 && (
                                  <Tooltip title="Remove" placement="bottom">
                                    <IconButton
                                      color="error"
                                      onClick={() => removePassengerFacilitator(index, pf_index)}
                                    >
                                      <Iconify icon="eva:minus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {pf_index === (trip.passenger_facilitators || []).length - 1 && (
                                  <Tooltip title="Add" placement="bottom">
                                    <IconButton
                                      color="primary"
                                      onClick={() => addPassengerFacilitator(index)}
                                    >
                                      <Iconify icon="eva:plus-fill" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                {index !== sheet.trips.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" py={2} px={3}>
            <Button
              // fullWidth
              variant="contained"
              style={{ textTransform: 'none' }}
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={addTrip}
            >
              Add Trip
            </Button>
          </Box>
        </Stack>
      </Card>

      <Grid container justifyContent="flex-end" spacing={3} pt={3}>
        <Grid xs={12} sm={6} md={1.5}>
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            variant="outlined"
            color="success"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Create
          </LoadingButton>
        </Grid>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={() => {
              if (changeMade) {
                handleClickAlert();
              } else {
                router.push('/sales_management/flight_brief_sheet/list');
              }
            }}
            variant="contained"
            color="error"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Close
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Created data or changes you where made can&apos;t be save..!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              router.push('/sales_management/flight_brief_sheet/list');
              handleClickAlert();
            }}
          >
            Yes, Close!
          </Button>
          <Button variant="outlined" onClick={handleClickAlert}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
