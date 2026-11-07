import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { TabList, TabContext, LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, TimePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Tab,
  Link,
  Card,
  Stack,
  Slide,
  styled,
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
  ListItemText,
  DialogContent,
  DialogActions,
  FormHelperText,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const HiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function NewPage() {
  const router = useRouter();
  // const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const [quoteNo, setQuoteNo] = useState('SAPL/NQ-0000');
  const [users, setUsers] = useState([]);
  // const [aircrafts, setAircrafts] = useState([]);
  // const [aircraftPax, setAircraftPax] = useState([{ label: 'Ferry', pax: 0 }]);
  const [airports, setAirports] = useState([]);
  const [quotation, setQuotation] = useState({
    customer_name: '',
    aircraft_name: '',
    aircraft_pax: '',
    manufacture_year: '',
    price: 0,
    type: 'oneway',
    status: 'New',
    trips: [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
      },
    ],
    assigned_to: null,
    aircraft: [],
    interior: [],
    lopa: [],
    cabin: [],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/nsop_quotation/next_number')
        .then((res) => setQuoteNo(res.data))
        .catch((error) => setQuoteNo('SAPL/NQ-0000'));

      await axios
        .get('/api/all_users')
        .then((res) => setUsers(res.data.results))
        .catch((error) => {
          setUsers([]);
        });

      // await axios
      //   .get('/api/list_aircraft_models')
      //   .then((res) => setAircrafts(res.data.results))
      //   .catch((error) => {
      //     setAircrafts([]);
      //   });

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
        handleInputChange('trips', [quotation.trips[0]]);
        break;
      case 'roundtrip':
        handleInputChange('trips', [
          quotation.trips[0],
          {
            departure_airport_id: quotation.trips[0].arrival_airport_id,
            arrival_airport_id: quotation.trips[0].departure_airport_id,
            pax: quotation.trips[0].pax,
            start_at: null,
            duration: 0,
          },
        ]);
        break;
      case 'multicity': {
        if (quotation.trips.length < 2) {
          const updatedTrips = [...quotation.trips];
          updatedTrips.push({
            departure_airport_id: quotation.trips[0].arrival_airport_id,
            arrival_airport_id: null,
            pax: 0,
            start_at: null,
            duration: 0,
          });
          handleInputChange('trips', updatedTrips);
        } else if (quotation.trips.length >= 2) {
          handleInputChange('trips', [
            quotation.trips[0],
            {
              ...quotation.trips[1],
              arrival_airport_id: null,
              pax: 0,
              start_at: null,
              duration: 0,
            },
          ]);
        }
      }
    }
    handleInputChange('type', value);
  };

  const renderImagePreviews = (images) =>
    images.map((image, index) => (
      <img
        key={index}
        src={URL.createObjectURL(image)}
        alt="preview"
        // style={{ width: '100px', height: '100px', margin: '5px' }}
        style={{ margin: '5px' }}
      />
    ));

  const handleInputChange = (field, value) => {
    setQuotation((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
    // setShowPreview(false);
  };

  const handleInputChangeTrips = (index, field, value) => {
    setValidationErrors({});
    // if (!quotation.aircraft_id) {
    //   enqueueSnackbar('Please select the aircraft model before the trip details..!', {
    //     variant: 'warning',
    //     action,
    //   });
    //   return;
    // }
    const newTrips = [...quotation.trips];

    if (index !== quotation.trips.length - 1 && field === 'arrival_airport_id')
      newTrips[index + 1].departure_airport_id = value;

    if (
      index !== quotation.trips.length - 1 &&
      field === 'departure_airport_id' &&
      quotation.type === 'roundtrip'
    )
      newTrips[index + 1].arrival_airport_id = value;

    newTrips[index][field] = value;

    if (field === 'departure_airport_id' || field === 'arrival_airport_id') {
      if (
        newTrips[index].departure_airport_id &&
        newTrips[index].arrival_airport_id &&
        newTrips[index].departure_airport_id === newTrips[index].arrival_airport_id
      ) {
        setValidationErrors({
          [`departure_airport_id_${index}`]: "Departure and Arrival can't be same.",
          [`arrival_airport_id_${index}`]: "Departure and Arrival can't be same.",
        });
      }
    }

    setQuotation((pre) => ({ ...pre, ...{ trips: newTrips } }));
    setChangeMade(true);
  };

  // const handleChangeAircraft = (event, value) => {
  //   if (value) {
  //     handleInputChange('aircraft_id', value.id);
  //     const pax = [];
  //     for (let i = 0; i <= value.seats; i += 1) {
  //       if (i === 0) pax.push({ label: 'Ferry', pax: i });
  //       else pax.push({ label: String(i), pax: i });
  //     }
  //     setAircraftPax(pax);
  //   } else {
  //     handleInputChange('aircraft_id', null);
  //     setAircraftPax([{ label: 'Ferry', pax: 0 }]);
  //   }
  // };

  const covertToTimeDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  };

  const addTrip = () => {
    const updatedTrips = [
      ...quotation.trips,
      ...[
        {
          departure_airport_id: null,
          arrival_airport_id: null,
          pax: 0,
          start_at: null,
          duration: 0,
        },
      ],
    ];
    setQuotation((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setChangeMade(true);
  };

  const removeTrip = (index) => {
    const updatedTrips = quotation.trips.filter((_t, i) => i !== index);
    setQuotation((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
    setChangeMade(true);
  };

  const removeAllTrips = () => {
    const updatedTrips = [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
      },
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        pax: 0,
        start_at: null,
        duration: 0,
      },
    ];
    setQuotation((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    const limits = {
      aircraft: 1,
      lopa: 1,
      cabin: 1,
      interior: 1,
    };

    if (files.length > limits[field]) {
      enqueueSnackbar(`You can only upload up to ${limits[field]} ${field} images.`, {
        variant: 'error',
        action,
      });
      handleInputChange(field, []);
    } else {
      handleInputChange(field, files);
    }
    e.target.value = null;
  };

  const validateData = () => {
    const errors = {};

    if (!quotation.customer_name) errors.customer_name = 'Customer Name is required';
    if (!quotation.aircraft_name) errors.aircraft_name = 'Aircraft Name is required';
    if (!quotation.aircraft_pax) errors.aircraft_pax = 'Aircraft Pax is required';
    if (!quotation.assigned_to) errors.assigned_to = 'Assigned To is required';
    if (!quotation.price) errors.price = 'Price is required';
    if (!quotation.manufacture_year) errors.manufacture_year = 'Manufacture year is required';
    // if (quotation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quotation.email))
    //   errors.email = 'Please enter a valid email';
    // if (!quotation.email) errors.email = 'Email is required';
    // if (!quotation.phone) errors.phone = 'Phone is required';

    // eslint-disable-next-line array-callback-return
    quotation.trips.map((trip, index) => {
      if (trip.departure_airport_id === trip.arrival_airport_id) {
        errors[`departure_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
        errors[`arrival_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
      }
      if (!trip.departure_airport_id)
        errors[`departure_airport_id_${index}`] = 'Departure Airport is required';
      if (!trip.arrival_airport_id)
        errors[`arrival_airport_id_${index}`] = 'Arrival Airport is required';
      if (!trip.start_at) errors[`start_at_${index}`] = 'Date & Time is required';
      if (!trip.duration) errors[`duration_${index}`] = 'Duration is required';
    });
    if (quotation.aircraft.length !== 1) errors.aircraft = 'Aircraft image is required.';
    if (quotation.interior.length !== 1) errors.interior = 'Interior image is required.';
    // if (quotation.lopa.length !== 1) errors.lopa = 'Please select exactly 1 lopa image.';
    // if (quotation.cabin.length !== 1) errors.cabin = 'Please select exactly 1 cabin image.';
    return errors;
  };

  // const handleSubmit = async (event) => {
  //   setLoading(true);
  //   const errors = validateData();
  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors);
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     await axios
  //       .post('/api/nsop_quotation', quotation)
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.status) {
  //           setLoading(false);
  //           router.push('/sales_management/nsop_quotation/list');
  //           enqueueSnackbar(response.data.message, {
  //             variant: response.data.status ? 'success' : 'error',
  //             action,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setTimeout(() => {
  //           setLoading(false);
  //           enqueueSnackbar(error.response.data.message, { variant: 'error', action });
  //         }, 3000);
  //       });
  //   } catch (error) {
  //     setTimeout(() => {
  //       setLoading(false);
  //       enqueueSnackbar(error.message, { variant: 'error', action });
  //     }, 3000);
  //   }
  // };

  const handleSubmit = async (event) => {
    setLoading(true);
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();

      formData.append('customer_name', quotation.customer_name);
      formData.append('aircraft_name', quotation.aircraft_name);
      formData.append('aircraft_pax', quotation.aircraft_pax);
      formData.append('manufacture_year', quotation.manufacture_year);
      formData.append('price', quotation.price);
      formData.append('assigned_to', quotation.assigned_to);
      formData.append('status', quotation.status);
      formData.append('type', quotation.type);
      formData.append('trips', JSON.stringify(quotation.trips));

      // Append aircraft images
      quotation.aircraft.forEach((file) => {
        formData.append('aircraft', file);
      });

      // Append lopa images
      quotation.lopa.forEach((file) => {
        formData.append('lopa', file);
      });

      // Append cabin images
      quotation.cabin.forEach((file) => {
        formData.append('cabin', file);
      });

      // Append interior images
      quotation.interior.forEach((file) => {
        formData.append('interior', file);
      });

      await axios
        .post('/api/nsop_quotation', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            router.push('/sales_management/nsop_quotation/list');
            setLoading(false);
            enqueueSnackbar(response.data.message, {
              variant: response.data.status ? 'success' : 'error',
              action,
            });
          }
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
            enqueueSnackbar(error.message, { variant: 'error', action });
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
    <Link key="2" underline="hover" color="inherit" href="/sales_management/nsop_quotation">
      NSOP&nbsp;Quotation
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;NSOP&nbsp;Quotation
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Create&nbsp;a&nbsp;new&nbsp;NSOP&nbsp;Quotation
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
                  Quotation Details :
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={4} md={3} mb={2}>
                  <TextField disabled fullWidth size="small" label="Quotation No" value={quoteNo} />
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
                    label="Customer Name"
                    size="small"
                    value={quotation.customer_name}
                    error={Boolean(validationErrors.customer_name)}
                    helperText={validationErrors.customer_name}
                    onChange={(event, value) =>
                      handleInputChange('customer_name', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Aircraft Name"
                    size="small"
                    value={quotation.aircraft_name}
                    error={Boolean(validationErrors.aircraft_name)}
                    helperText={validationErrors.aircraft_name}
                    onChange={(event, value) =>
                      handleInputChange('aircraft_name', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Aircraft Pax"
                    size="small"
                    value={quotation.aircraft_pax}
                    error={Boolean(validationErrors.aircraft_pax)}
                    helperText={validationErrors.aircraft_pax}
                    onChange={(event, value) =>
                      handleInputChange('aircraft_pax', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Manufacture Year"
                    size="small"
                    value={quotation.manufacture_year}
                    error={Boolean(validationErrors.manufacture_year)}
                    helperText={validationErrors.manufacture_year}
                    onChange={(event, value) =>
                      handleInputChange('manufacture_year', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Price"
                    size="small"
                    value={quotation.price}
                    error={Boolean(validationErrors.price)}
                    helperText={validationErrors.price}
                    onChange={(event, value) => handleInputChange('price', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={6} />
                <Grid xs={12} sm={4} md={3}>
                  <Autocomplete
                    size="small"
                    value={users.find((_u) => _u.id === quotation.assigned_to) || null}
                    onChange={(event, value) => {
                      handleInputChange('assigned_to', value ? value.id : null);
                    }}
                    options={users}
                    getOptionLabel={(option) => option.email}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Assigned To"
                        error={Boolean(validationErrors.assigned_to)}
                        helperText={validationErrors.assigned_to}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    id="customer_email"
                    label="Email"
                    size="small"
                    value={quotation.email}
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
                    value={quotation.phone}
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
                    value={aircrafts.find((_air) => _air.id === quotation.aircraft_id) || null}
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
                    value={quotation.remark}
                    error={Boolean(validationErrors.remark)}
                    helperText={validationErrors.remark}
                    onChange={(event, value) => handleInputChange('remark', event.target.value)}
                  />
                </Grid> */}
              </Grid>
            </Box>
            <Box p={3}>
              {/* <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Trip Details :
                </Typography>
              </Box> */}
              <TabContext value={quotation.type}>
                <TabList onChange={(e, newValue) => handleTabChange(newValue)}>
                  <Tab label="One Way" value="oneway" />
                  <Tab label="Round Trip" value="roundtrip" />
                  <Tab label="Multi City" value="multicity" />
                </TabList>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </TabContext>
              <Box py={2}>
                {quotation.trips.map((trip, index) => (
                  <Grid key={index} container spacing={2} paddingBlockEnd={1}>
                    <Grid xs={12} sm={6} md={3}>
                      <Autocomplete
                        id="departure_airport"
                        fullWidth
                        disabled={quotation.type === 'roundtrip' && index === 1}
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
                      <Autocomplete
                        id="arrival_airport"
                        fullWidth
                        disabled={quotation.type === 'roundtrip' && index === 1}
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
                    <Grid xs={4} sm={4} md={1.5}>
                      <TextField
                        // required
                        fullWidth
                        label="Pax"
                        size="small"
                        value={trip.pax}
                        error={Boolean(validationErrors[`pax_${index}`])}
                        helperText={validationErrors[`pax_${index}`]}
                        onChange={(event) =>
                          handleInputChangeTrips(index, 'pax', event.target.value)
                        }
                      />
                      {/* <Autocomplete
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
                      /> */}
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
                    <Grid xs={6} sm={6} md={quotation.type === 'multicity' ? 1.5 : 2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          label="Flying Hours (hh:mm)"
                          ampm={false}
                          format="HH    :    mm"
                          value={dayjs(`2000-01-01T${covertToTimeDuration(trip.duration)}`)}
                          onChange={(event) => {
                            handleInputChangeTrips(index, 'duration', event.$H * 60 + event.$m);
                          }}
                          views={['hours', 'minutes']}
                          slotProps={{
                            textField: {
                              size: 'small',
                              required: true,
                              error: Boolean(validationErrors[`duration_${index}`]),
                              helperText: validationErrors[`duration_${index}`],
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {quotation.type === 'multicity' && (
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
                {quotation.type === 'multicity' && (
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
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Grid container spacing={3} py={2}>
                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <ListItemText
                      primary="Aircraft"
                      secondary="Please select one aircraft image."
                    />
                    <Stack direction="row" gap={3}>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<Iconify icon="solar:gallery-add-bold" />}
                      >
                        Add Images
                        <HiddenInput
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif"
                          multiple
                          onChange={(e) => handleFileChange(e, 'aircraft')}
                        />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleInputChange('aircraft', [])}
                        startIcon={<Iconify icon="solar:gallery-remove-bold" />}
                      >
                        Remove Images
                      </Button>
                    </Stack>
                    {Boolean(validationErrors.aircraft) && (
                      <FormHelperText error>{validationErrors.aircraft}</FormHelperText>
                    )}
                    <Box mt={1}>{renderImagePreviews(quotation.aircraft)}</Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <ListItemText
                      primary="Interior"
                      secondary="Please select one interior image."
                    />
                    <Stack direction="row" gap={3}>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<Iconify icon="solar:gallery-add-bold" />}
                      >
                        Add Images
                        <HiddenInput
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif"
                          multiple
                          onChange={(e) => handleFileChange(e, 'interior')}
                        />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleInputChange('interior', [])}
                        startIcon={<Iconify icon="solar:gallery-remove-bold" />}
                      >
                        Remove Images
                      </Button>
                    </Stack>
                    {Boolean(validationErrors.interior) && (
                      <FormHelperText error>{validationErrors.interior}</FormHelperText>
                    )}
                    <Box mt={1}>{renderImagePreviews(quotation.interior)}</Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <ListItemText primary="Lopa" secondary="Please select one lopa image." />
                    <Stack direction="row" gap={3}>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<Iconify icon="solar:gallery-add-bold" />}
                      >
                        Add Image
                        <HiddenInput
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif"
                          multiple
                          onChange={(e) => handleFileChange(e, 'lopa')}
                        />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleInputChange('lopa', [])}
                        startIcon={<Iconify icon="solar:gallery-remove-bold" />}
                      >
                        Remove Image
                      </Button>
                    </Stack>
                    {Boolean(validationErrors.lopa) && (
                      <FormHelperText error>{validationErrors.lopa}</FormHelperText>
                    )}
                    <Box mt={1}>{renderImagePreviews(quotation.lopa)}</Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <ListItemText primary="Cabin" secondary="Please select one cabin image." />
                    <Stack direction="row" gap={3}>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<Iconify icon="solar:gallery-add-bold" />}
                      >
                        Add Image
                        <HiddenInput
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif"
                          multiple
                          onChange={(e) => handleFileChange(e, 'cabin')}
                        />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleInputChange('cabin', [])}
                        startIcon={<Iconify icon="solar:gallery-remove-bold" />}
                      >
                        Remove Image
                      </Button>
                    </Stack>
                    {Boolean(validationErrors.cabin) && (
                      <FormHelperText error>{validationErrors.cabin}</FormHelperText>
                    )}
                    <Box mt={1}>{renderImagePreviews(quotation.cabin)}</Box>
                  </Box>
                </Grid>
              </Grid>
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
                router.push('/sales_management/nsop_quotation/list');
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
              router.push('/sales_management/nsop_quotation/list');
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
