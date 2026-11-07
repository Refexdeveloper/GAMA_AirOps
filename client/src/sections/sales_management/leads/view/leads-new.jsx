import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { TabList, TabContext, LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Tab,
  Link,
  Card,
  Stack,
  Slide,
  Dialog,
  Button,
  Tooltip,
  Divider,
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
  // const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const [leadNo, setLeadNo] = useState('SAPL/LD-0000');
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftPax, setAircraftPax] = useState([{ label: 'Ferry', pax: 0 }]);
  const [airports, setAirports] = useState([]);
  const [lead, setLead] = useState({
    name: '',
    email: '',
    phone: '',
    remark: '',
    type: 'oneway',
    aircraft_id: null,
    status: 'New',
    trips: [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
      },
    ],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/lead/next_number')
        .then((res) => setLeadNo(res.data))
        .catch((error) => setLeadNo('SAPL/LD-0000'));

      // await axios
      //   .get('/api/all_users')
      //   .then((res) => setUsers(res.data.results))
      //   .catch((error) => {
      //     setUsers([]);
      //   });

      await axios
        .get('/api/list_aircraft_models')
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

  const handleTabChange = (value) => {
    // eslint-disable-next-line default-case
    switch (value) {
      case 'oneway':
        handleInputChange('trips', [lead.trips[0]]);
        break;
      case 'roundtrip':
        handleInputChange('trips', [
          lead.trips[0],
          {
            departure_airport_id: lead.trips[0].arrival_airport_id,
            arrival_airport_id: lead.trips[0].departure_airport_id,
            pax: lead.trips[0].pax,
            start_at: null,
          },
        ]);
        break;
      case 'multicity': {
        if (lead.trips.length < 2) {
          const updatedTrips = [...lead.trips];
          updatedTrips.push({
            departure_airport_id: lead.trips[0].arrival_airport_id,
            arrival_airport_id: null,
            pax: 0,
            start_at: null,
          });
          handleInputChange('trips', updatedTrips);
        } else if (lead.trips.length >= 2) {
          handleInputChange('trips', [
            lead.trips[0],
            {
              ...lead.trips[1],
              arrival_airport_id: null,
              pax: 0,
              start_at: null,
            },
          ]);
        }
      }
    }
    handleInputChange('type', value);
  };

  const handleInputChange = (field, value) => {
    setLead((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
    // setShowPreview(false);
  };

  const handleInputChangeTrips = (index, field, value) => {
    setValidationErrors({});
    if (!lead.aircraft_id) {
      enqueueSnackbar('Please select the aircraft model before the trip details..!', {
        variant: 'warning',
        action,
      });
      return;
    }
    const newTrips = [...lead.trips];

    if (index !== lead.trips.length - 1 && field === 'arrival_airport_id')
      newTrips[index + 1].departure_airport_id = value;

    if (
      index !== lead.trips.length - 1 &&
      field === 'departure_airport_id' &&
      lead.type === 'roundtrip'
    )
      newTrips[index + 1].arrival_airport_id = value;

    newTrips[index][field] = value;

    if (field === 'departure_airport_id' || field === 'arrival_airport_id') {
      if (newTrips[index].departure_airport_id === newTrips[index].arrival_airport_id) {
        setValidationErrors({
          [`departure_airport_id_${index}`]: "Departure and Arrival can't be same.",
          [`arrival_airport_id_${index}`]: "Departure and Arrival can't be same.",
        });
      }
    }

    setLead((pre) => ({ ...pre, ...{ trips: newTrips } }));
    setChangeMade(true);
  };

  const handleChangeAircraft = (event, value) => {
    if (value) {
      handleInputChange('aircraft_id', value.id);
      const pax = [];
      for (let i = 0; i <= value.seats; i += 1) {
        if (i === 0) pax.push({ label: 'Ferry', pax: i });
        else pax.push({ label: String(i), pax: i });
      }
      setAircraftPax(pax);
    } else {
      handleInputChange('aircraft_id', null);
      setAircraftPax([{ label: 'Ferry', pax: 0 }]);
    }
  };

  const addTrip = () => {
    const updatedTrips = [
      ...lead.trips,
      ...[
        {
          departure_airport_id: null,
          arrival_airport_id: null,
          pax: 0,
          start_at: null,
        },
      ],
    ];
    setLead((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setChangeMade(true);
  };

  const removeTrip = (index) => {
    const updatedTrips = lead.trips.filter((_t, i) => i !== index);
    setLead((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setChangeMade(true);
  };

  const removeAllTrips = () => {
    const updatedTrips = [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
      },
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
      },
    ];
    setLead((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
  };

  const validateData = () => {
    const errors = {};

    if (!lead.name) errors.name = 'Customer Name is required';
    if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      errors.email = 'Please enter a valid email';
    if (!lead.email) errors.email = 'Email is required';
    if (!lead.phone) errors.phone = 'Phone is required';
    if (!lead.aircraft_id) errors.aircraft_id = 'Aircraft ID is required';

    // eslint-disable-next-line array-callback-return
    lead.trips.map((trip, index) => {
      if (trip.departure_airport_id === trip.arrival_airport_id) {
        errors[`departure_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
        errors[`arrival_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
      }
      if (!trip.departure_airport_id)
        errors[`departure_airport_id_${index}`] = 'Departure Airport is required';
      if (!trip.arrival_airport_id)
        errors[`arrival_airport_id_${index}`] = 'Arrival Airport is required';
      if (!trip.start_at) errors[`start_at_${index}`] = 'Date & Time is required';
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
        .post('/api/lead', lead)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/sales_management/leads/list');
            enqueueSnackbar(response.data.message, {
              variant: response.data.status ? 'success' : 'error',
              action,
            });
          }
        })
        .catch((error) => {
          console.log(error);
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
    <Link key="2" underline="hover" color="inherit" href="/sales_management/leads">
      Leads
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;Lead
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Create&nbsp;a&nbsp;new&nbsp;lead
            </Typography>
            <Breadcrumbs
              separator={<Iconify icon="eva:chevron-right-fill" />}
              aria-label="breadcrumb"
              sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
        </Stack>
        <Card sx={{ overflow: 'visible' }}>
          <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            <Box p={3}>
              <Box mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Lead Details :
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={4} md={3} mb={2}>
                  <TextField disabled fullWidth size="small" label="Lead No" value={leadNo} />
                </Grid>
                <Grid xs={12} sm={4} md={3} mb={2}>
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
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    id="customer_name"
                    label="Customer Name"
                    size="small"
                    value={lead.name}
                    error={Boolean(validationErrors.name)}
                    helperText={validationErrors.name}
                    onChange={(event, value) => handleInputChange('name', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    id="customer_email"
                    label="Email"
                    size="small"
                    value={lead.email}
                    error={Boolean(validationErrors.email)}
                    helperText={validationErrors.email}
                    onChange={(event, value) => handleInputChange('email', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    id="customer_phone"
                    label="Phone"
                    size="small"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={lead.phone}
                    error={Boolean(validationErrors.phone)}
                    helperText={validationErrors.phone}
                    onChange={(event) => {
                      const { value } = event.target;
                      if (/^\d{0,10}$/.test(value)) {
                        handleInputChange('phone', value);
                      }
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <Autocomplete
                    id="aircraft_id"
                    size="small"
                    getOptionLabel={(option) => option.aircraft_model}
                    value={aircrafts.find((_air) => _air.id === lead.aircraft_id) || null}
                    onChange={handleChangeAircraft}
                    options={aircrafts}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Aircraft Model"
                        error={Boolean(validationErrors.aircraft_id)}
                        helperText={validationErrors.aircraft_id}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    id="customer_remark"
                    label="Remark"
                    multiline
                    rows={2}
                    value={lead.remark}
                    error={Boolean(validationErrors.remark)}
                    helperText={validationErrors.remark}
                    onChange={(event, value) => handleInputChange('remark', event.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box p={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Trip Details :
                </Typography>
              </Box>
              <TabContext value={lead.type}>
                <TabList onChange={(e, newValue) => handleTabChange(newValue)}>
                  <Tab label="One Way" value="oneway" />
                  <Tab label="Round Trip" value="roundtrip" />
                  <Tab label="Multi City" value="multicity" />
                </TabList>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </TabContext>
              <Box pt={2}>
                {lead.trips.map((trip, index) => (
                  <Grid key={index} container spacing={2} paddingBlockEnd={1}>
                    <Grid xs={12} sm={6} md={4}>
                      <Autocomplete
                        id="departure_airport"
                        fullWidth
                        disabled={lead.type === 'roundtrip' && index === 1}
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
                    <Grid xs={12} sm={6} md={4}>
                      <Autocomplete
                        id="arrival_airport"
                        fullWidth
                        disabled={lead.type === 'roundtrip' && index === 1}
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
                    <Grid xs={4} sm={4} md={lead.type === 'multicity' ? 1 : 1.5}>
                      <Autocomplete
                        id="pax"
                        fullWidth
                        size="small"
                        value={aircraftPax.find((_ap) => _ap.pax === trip.pax) || null}
                        onChange={(event, value) => {
                          if (value) handleInputChangeTrips(index, 'pax', value.pax);
                          else handleInputChangeTrips(index, 'pax', 0);
                        }}
                        options={aircraftPax}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Pax"
                            error={Boolean(validationErrors[`pax_${index}`])}
                            helperText={validationErrors[`pax_${index}`]}
                          />
                        )}
                      />
                    </Grid>
                    <Grid xs={8} sm={8} md={2.5}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Departure Date & Time"
                          format="DD/MM/YYYY HH:mm"
                          ampm={false}
                          value={dayjs(trip.start_at)}
                          onChange={
                            (newValue) => {
                              // console.log(newValue.format('YYYY-MM-DD HH:mm:ss'));
                              handleInputChangeTrips(
                                index,
                                'start_at',
                                newValue.format('YYYY-MM-DD HH:mm:ss')
                              );
                            }
                            // handleInputChangeTrips(index, 'start_at', newValue)
                          }
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
                    {lead.type === 'multicity' && (
                      <>
                        {index === 0 ? (
                          <Grid
                            xs={1.5}
                            md={0.5}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Tooltip title="Remove All" placement="right">
                              <IconButton color="error" onClick={removeAllTrips}>
                                <Iconify icon="eva:close-fill" />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        ) : (
                          <>
                            {index !== 1 && (
                              <Grid
                                xs={1.5}
                                md={0.5}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Tooltip title="Remove" placement="right">
                                  <IconButton color="error" onClick={() => removeTrip(index)}>
                                    <Iconify icon="eva:minus-fill" />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                ))}
                {lead.type === 'multicity' && (
                  <Box display="flex" justifyContent="flex-end" alignItems="center" pt={2}>
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
                )}
              </Box>
            </Box>
          </Stack>
        </Card>
      </Stack>
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
                router.push('/sales_management/leads/list');
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
              router.push('/sales_management/leads/list');
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
