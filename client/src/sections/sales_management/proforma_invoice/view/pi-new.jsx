import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, TimePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Link,
  Card,
  Stack,
  Slide,
  Dialog,
  Button,
  Tooltip,
  Divider,
  useTheme,
  TextField,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  OutlinedInput,
  InputAdornment,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { FIndian, FFIndian } from 'src/utils/format-number';

import { useAuth } from 'src/context/AuthContext';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { applyFilter, getComparator } from '../utils';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const FFCurrency = (value = 0) => <>₹&nbsp;{FFIndian(value)}</>;

export default function NewPage() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const { user } = useAuth();
  const hsn_sac = [996426];
  const [invoiceNo, setInvoiceNo] = useState('SAPL/PI-0000');
  const [invoice, setInvoice] = useState({
    bill_to: null,
    aircraft_id: null,
    aircraft_reg_no: '',
    aircraft_model_name: '',
    trips: [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        start_at: null,
        duration: 0,
        cost: 0,
      },
    ],
    charges: [
      {
        title: 'Airport Handling Charges',
        cost: 0,
      },
      {
        title: 'Crew Accomodation Charges',
        cost: 0,
      },
      {
        title: 'Ground Handling Charges',
        cost: 0,
      },
      {
        title: 'Halt Charges',
        cost: 0,
      },
      {
        title: 'Other Charges',
        cost: 0,
      },
    ],
    trip_cost: 0,
    sub_total: 0,
    discount: 0,
    st_after_discount: 0,
    gst: 0,
    grand_total: 0,
    hsn_sac: 996426,
    assigned_to: user.id,
  });
  const [customers, setCustomers] = useState([
    { id: 0, name: '', email: '', phone: '', address: '' },
  ]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/api/proforma_invoice/next_number')
        .then((res) => setInvoiceNo(res.data))
        .catch((error) => setInvoiceNo('SAPL/PI-0000'));

      await axios
        .get('/api/all_customers')
        .then((res) => {
          setCustomers(res.data.results);
        })
        .catch((error) => {
          setCustomers([]);
        });

      await axios
        .get('/api/all_aircrafts')
        .then((res) => setAircrafts(res.data.results))
        .catch((error) => {
          setAircrafts([]);
        });

      await axios
        .get('/api/airports')
        .then((res) => {
          setAirports(res.data);
        })
        .catch((error) => {
          setAirports([]);
        });

      await axios
        .get('/api/all_users')
        .then((res) => setUsers(res.data.results))
        .catch((error) => {
          setUsers([]);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const trip_cost = invoice.trips.reduce((total, trip) => total + trip.cost, 0);
    const charges = invoice.charges.reduce((total, charge) => total + charge.cost, 0);
    const sub_total = trip_cost + charges;
    const st_after_discount = sub_total - invoice.discount;
    const gst = st_after_discount * 0.18;
    const grand_total = st_after_discount + gst;

    setInvoice((pre) => ({
      ...pre,
      ...{ trip_cost, sub_total, st_after_discount, gst, grand_total },
    }));
  }, [invoice.trips, invoice.charges, invoice.discount]);

  const covertToTimeDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (field, value) => {
    setInvoice((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const applyFleetAircraft = (ac) => {
    if (!ac) {
      setInvoice((pre) => ({
        ...pre,
        aircraft_id: null,
        aircraft_reg_no: '',
        aircraft_model_name: '',
      }));
    } else {
      setInvoice((pre) => ({
        ...pre,
        aircraft_id: ac.id,
        aircraft_reg_no: ac.reg_no,
        aircraft_model_name: ac.model?.aircraft_model || '',
      }));
    }
    setValidationErrors((prev) => ({
      ...prev,
      aircraft_id: undefined,
      aircraft_reg_no: undefined,
      aircraft_model_name: undefined,
    }));
    setChangeMade(true);
  };

  const handleInputChangeTrips = (index, field, value) => {
    const newTrips = [...invoice.trips];
    newTrips[index][field] = value;
    setInvoice((pre) => ({ ...pre, ...{ trips: newTrips } }));
    setChangeMade(true);
  };

  const removeAllTrips = () => {
    const updatedTrips = [
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        start_at: null,
        duration: 0,
        cost: 0,
      },
    ];
    setInvoice((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
  };

  const removeTrip = (index) => {
    const updatedTrips = invoice.trips.filter((_t, i) => i !== index);
    setInvoice((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
  };

  const addTrip = () => {
    const updatedTrips = [
      ...invoice.trips,
      {
        departure_airport_id: null,
        arrival_airport_id: null,
        start_at: null,
        duration: 0,
        cost: 0,
      },
    ];
    setInvoice((pre) => ({ ...pre, ...{ trips: updatedTrips } }));
  };

  const handleInputChangeCharges = (index, field, value) => {
    const newCharges = [...invoice.charges];
    newCharges[index][field] = value;
    setInvoice((pre) => ({ ...pre, ...{ charges: newCharges } }));
    setChangeMade(true);
  };

  const validateData = () => {
    const errors = {};
    if (!invoice.bill_to) errors.bill_to = 'Please select the customer..!';
    if (!invoice.hsn_sac) errors.hsn_sac = 'HSN/SAC is required';
    if (!invoice.aircraft_id) {
      if (!String(invoice.aircraft_reg_no || '').trim()) {
        errors.aircraft_reg_no = 'Aircraft Regn. is required (or select from fleet)';
      }
      if (!String(invoice.aircraft_model_name || '').trim()) {
        errors.aircraft_model_name = 'Aircraft Model is required (or select from fleet)';
      }
    }
    if (!invoice.assigned_to) errors.assigned_to = 'Assigned To is required';
    // eslint-disable-next-line array-callback-return
    invoice.trips.map((trip, index) => {
      if (trip.departure_airport_id === trip.arrival_airport_id) {
        errors[`departure_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
        errors[`arrival_airport_id_${index}`] = "Departure and Arrival Airport can't be same";
      }
      if (!trip.departure_airport_id)
        errors[`departure_airport_id_${index}`] = 'Departure Airport is required';
      if (!trip.arrival_airport_id)
        errors[`arrival_airport_id_${index}`] = 'Arrival Airport is required';
      if (!trip.start_at) errors[`start_at_${index}`] = 'Date & Time is required';
      if (!trip.cost) errors[`cost_${index}`] = 'Cost is required';
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
        .post('/api/proforma_invoice', invoice)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/sales_management/proforma_invoice/list');
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

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickAlert = () => {
    setOpenAlert(!openAlert);
  };

  const handleClickAddCustomer = () => {
    setOpenCustomer(!openCustomer);
  };

  // const dataFiltered = customers;

  const selectedCustomer = customers.find((_cus) => _cus.id === invoice.bill_to);

  // console.log(selectedCustomer);

  const dataFiltered = applyFilter({
    inputData: customers,
    comparator: getComparator('asc', 'name'),
    filterName: searchTerm,
  });

  const notFound = !dataFiltered.length && !!searchTerm;

  const breadcrumbs = [
    <Link key="1" underline="hover" color="inherit" href="/sales_management">
      Sales&nbsp;Management
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Link key="2" underline="hover" color="inherit" href="/sales_management/proforma_invoice">
      Proforma&nbsp;Invoice
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;Invoice
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Create&nbsp;a&nbsp;new&nbsp;proforma&nbsp;invoice
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
        <Stack>
          <Box>
            <Typography component="div" variant="h6" sx={{ p: 3, fontWeight: 700 }}>
              Invoice Details :
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              gap={{ xs: 2, lg: 8 }}
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ px: 3, pb: 3 }}
            >
              <Stack width={1}>
                <Stack direction="row" width={1} sx={{ alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" width={1} color={theme.palette.text.disabled}>
                    Company :
                  </Typography>
                  <IconButton>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Stack>
                <Stack gap={1}>
                  <Typography component="h6" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    SPARZANA AVIATION PRIVATE LIMITED
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem' }}>
                    313, 4th Floor, Refex Towers, Sterling Road Signal, Valluvar Kottam High Road,
                    Nungambakkam, Chennai - 34, TN, India.
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem' }}>CIN: U62100TN2019PTC128018</Typography>
                  <Typography sx={{ fontSize: '0.875rem' }}>GST: 33ABBCS7395H1Z2</Typography>
                </Stack>
              </Stack>
              <Stack width={1}>
                <Stack direction="row" width={1} sx={{ alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" width={1} color={theme.palette.text.disabled}>
                    Bill To :
                  </Typography>
                  <IconButton onClick={handleClickAddCustomer}>
                    <Iconify icon={invoice.bill_to ? 'solar:pen-bold' : 'eva:plus-outline'} />
                  </IconButton>
                </Stack>
                {invoice.bill_to && (
                  <Stack gap={1}>
                    {selectedCustomer.type !== 'Individual' && (
                      <Typography component="h6" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {selectedCustomer.company_name}
                      </Typography>
                    )}
                    <Typography component="h6" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {selectedCustomer.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem' }}>{selectedCustomer.email}</Typography>
                    <Typography sx={{ fontSize: '0.875rem' }}>
                      {selectedCustomer.address}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem' }}>{selectedCustomer.phone}</Typography>
                    {selectedCustomer.type !== 'Individual' && (
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        GST :{selectedCustomer.gst_no}
                      </Typography>
                    )}
                  </Stack>
                )}
                {Boolean(validationErrors.bill_to) && (
                  <Typography variant="subtitle2" color={theme.palette.error.main}>
                    {validationErrors.bill_to}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              gap={{ xs: 3, md: 2 }}
              p={3}
              sx={{ backgroundColor: theme.palette.action.hover }}
            >
              <TextField disabled fullWidth label="Invoice No" value={invoiceNo} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  disabled
                  fullWidth
                  label="Date Created"
                  defaultValue={dayjs(new Date())}
                  format="DD / MM / YYYY"
                />
              </LocalizationProvider>
              <Autocomplete
                disableClearable
                fullWidth
                value={hsn_sac.find((_hs) => _hs === invoice.hsn_sac) || null}
                onChange={(event, value) => handleInputChange('hsn_sac', value)}
                options={hsn_sac}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="HSN/SAC"
                    error={Boolean(validationErrors.hsn_sac)}
                    helperText={validationErrors.hsn_sac}
                  />
                )}
              />
              <Autocomplete
                fullWidth
                value={users.find((_u) => _u.id === invoice.assigned_to) || null}
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
            </Stack>
          </Box>
          <Box p={3}>
            <Grid container spacing={2} mb={{ xs: 3, sm: 2 }}>
              <Grid xs={12} sm={3} md={3} display="flex" alignItems="center">
                <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
                  Trip & Cost :
                </Typography>
              </Grid>
              <Grid xs={false} sm={4} md={6} />
              <Grid xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Aircraft
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Select from your fleet, or enter registration and model manually.
                </Typography>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Autocomplete
                  size="small"
                  options={aircrafts}
                  getOptionLabel={(option) => `${option.model.aircraft_model} (${option.reg_no})`}
                  value={aircrafts.find((_air) => _air.id === invoice.aircraft_id) || null}
                  onChange={(event, value) => applyFleetAircraft(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select from fleet"
                      placeholder="Search aircraft…"
                      error={Boolean(
                        validationErrors.aircraft_id ||
                          validationErrors.aircraft_reg_no ||
                          validationErrors.aircraft_model_name
                      )}
                      helperText={
                        validationErrors.aircraft_id ||
                        (!invoice.aircraft_id ? 'Optional if you fill manual details below' : '')
                      }
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Aircraft Regn."
                  placeholder="e.g. VT-RFX"
                  value={invoice.aircraft_reg_no}
                  disabled={Boolean(invoice.aircraft_id)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInvoice((pre) => ({ ...pre, aircraft_reg_no: v }));
                    setValidationErrors((prev) => ({ ...prev, aircraft_reg_no: undefined }));
                    setChangeMade(true);
                  }}
                  error={Boolean(validationErrors.aircraft_reg_no)}
                  helperText={
                    validationErrors.aircraft_reg_no ||
                    (invoice.aircraft_id ? 'From selected aircraft' : 'Required if not using fleet list')
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Aircraft Model"
                  placeholder="e.g. Hawker 900XP"
                  value={invoice.aircraft_model_name}
                  disabled={Boolean(invoice.aircraft_id)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInvoice((pre) => ({ ...pre, aircraft_model_name: v }));
                    setValidationErrors((prev) => ({ ...prev, aircraft_model_name: undefined }));
                    setChangeMade(true);
                  }}
                  error={Boolean(validationErrors.aircraft_model_name)}
                  helperText={
                    validationErrors.aircraft_model_name ||
                    (invoice.aircraft_id ? 'From selected aircraft' : 'Required if not using fleet list')
                  }
                />
              </Grid>
            </Grid>

            {invoice.trips.map((trip, index) => (
              <Grid key={index} container spacing={2} mb={2}>
                <Grid xs={12} sm={6} md={3}>
                  <Autocomplete
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    value={airports.find((_a) => _a.airport_id === trip.arrival_airport_id) || null}
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
                <Grid xs={6} sm={6} md={2.3}>
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
                <Grid xs={6} sm={6} md={1.5}>
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
                        textField: { size: 'small' },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6} sm={4} md={1.5}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="Trip Cost"
                    value={FIndian(trip.cost)}
                    onChange={(event) => {
                      const { value } = event.target;
                      let numericValue = value.replace(/[^\d.]/g, '');
                      if (numericValue === '') {
                        handleInputChangeTrips(index, 'cost', 0);
                      } else if (/^\d*\.?\d*$/.test(numericValue)) {
                        numericValue = numericValue.replace(/^0+(?=\d)/, '');
                        handleInputChangeTrips(index, 'cost', Number(numericValue));
                      }
                    }}
                    InputProps={{
                      inputMode: 'numeric',
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    error={Boolean(validationErrors[`cost_${index}`])}
                    helperText={validationErrors[`cost_${index}`]}
                  />
                </Grid>
                <Grid xs={3} sm={2} md={0.7}>
                  <Stack
                    spacing={1}
                    direction="row"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {index === 0 && invoice.trips.length > 1 && (
                      <Tooltip title="Remove All" placement="bottom">
                        <IconButton color="error" onClick={() => removeAllTrips()}>
                          <Iconify icon="eva:close-fill" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {index !== 0 && (
                      <Tooltip title="Remove" placement="bottom">
                        <IconButton color="error" onClick={() => removeTrip(index)}>
                          <Iconify icon="eva:minus-fill" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {index === invoice.trips.length - 1 && (
                      <Tooltip title="Add Trip" placement="bottom">
                        <IconButton color="primary" onClick={() => addTrip()}>
                          <Iconify icon="eva:plus-fill" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            ))}
            <Grid container spacing={2}>
              {invoice.charges.map((charge, index) => (
                <Grid key={index} xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    size="small"
                    label={charge.title}
                    value={FIndian(charge.cost)}
                    onChange={(event) => {
                      const { value } = event.target;
                      let numericValue = value.replace(/[^\d.]/g, '');
                      if (numericValue === '') {
                        handleInputChangeCharges(index, 'cost', 0);
                      } else if (/^\d*\.?\d*$/.test(numericValue)) {
                        numericValue = numericValue.replace(/^0+(?=\d)/, '');
                        handleInputChangeCharges(index, 'cost', Number(numericValue));
                      }
                    }}
                    InputProps={{
                      inputMode: 'numeric',
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              ))}
              <Grid md={9.6} display={{ xs: 'none', md: 'block' }} />
              <Grid xs={12} sm={6} md={2.4}>
                <TextField
                  variant="filled"
                  size="small"
                  fullWidth
                  label="Discount"
                  focused
                  color="error"
                  value={FIndian(invoice.discount)}
                  onChange={(event) => {
                    const { value } = event.target;
                    let numericValue = value.replace(/[^\d.]/g, '');
                    if (numericValue === '') {
                      handleInputChange('discount', 0);
                    } else if (/^\d*\.?\d*$/.test(numericValue)) {
                      numericValue = numericValue.replace(/^0+(?=\d)/, '');
                      handleInputChange('discount', Number(numericValue));
                    }
                  }}
                  InputProps={{
                    inputMode: 'numeric',
                    startAdornment: <InputAdornment position="start">-₹</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
            <Stack direction="column" gap={2} textAlign="right" marginTop={4} alignItems="flex-end">
              <Stack direction="row">
                <Box>Sub Total</Box>
                <Box sx={{ width: { xs: 140, sm: 160 }, fontWeight: 600 }}>
                  {FFCurrency(invoice.sub_total)}
                </Box>
              </Stack>
              <Stack direction="row">
                <Box>Discount</Box>
                <Box sx={{ width: { xs: 140, sm: 160 }, color: theme.palette.error.main }}>
                  - {FFCurrency(invoice.discount)}
                </Box>
              </Stack>
              <Stack direction="row">
                <Box>Sub&nbsp;Total (After&nbsp;Discount)</Box>
                <Box sx={{ width: { xs: 140, sm: 160 }, fontWeight: 600 }}>
                  {FFCurrency(invoice.st_after_discount)}
                </Box>
              </Stack>
              <Stack direction="row">
                <Box>GST (18%)</Box>
                <Box sx={{ width: { xs: 140, sm: 160 } }}>{FFCurrency(invoice.gst)}</Box>
              </Stack>
              <Stack direction="row">
                <Box sx={{ fontWeight: 600 }}>Grand Total</Box>
                <Box sx={{ width: { xs: 140, sm: 160 }, fontWeight: 600 }}>
                  {FFCurrency(invoice.grand_total)}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Card>

      {/* Buttons */}
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
                router.push('/sales_management/proforma_invoice/list');
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

      {/* Add Customer Box  */}
      <Dialog fullWidth maxWidth="xs" open={openCustomer} onClose={handleClickAddCustomer}>
        <Stack p={3} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Customers</Typography>
          <Button
            color="inherit"
            onClick={() => {
              router.push('/sales_management/customers/new');
              handleClickAddCustomer();
            }}
            startIcon={<Iconify icon="eva:plus-outline" />}
          >
            New
          </Button>
        </Stack>
        <Stack px={3} pb={3}>
          <OutlinedInput
            value={searchTerm}
            onChange={handleSearchTerm}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
            fullWidth
            // sx={{ width: 600 }}
          />
        </Stack>
        <Scrollbar
          sx={{
            p: 0.5,
            maxHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {dataFiltered.map((row) => (
            <Button
              key={row.id}
              color="inherit"
              onClick={() => {
                handleInputChange('bill_to', row.id);
                handleClickAddCustomer();
                setSearchTerm('');
              }}
              sx={{
                width: '100%',
                my: 0.5,
                py: 1,
                px: 1.5,
                gap: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                ...(row.id === invoice.bill_to && {
                  backgroundColor: theme.palette.action.selected,
                }),
              }}
            >
              <Stack>
                <Typography variant="subtitle2">{row.name}</Typography>
              </Stack>
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                }}
              >
                {row.email}
              </Box>
              <Typography variant="body2" textAlign="left">
                {row.address}
              </Typography>
              <Typography variant="body2">{row.phone}</Typography>
            </Button>
          ))}
          {dataFiltered.length < 1 && !notFound && (
            <Stack spacing={1} p={3}>
              <Box
                component="img"
                src="/assets/icons/ic_content.svg"
                sx={{ height: 120, mx: 'auto' }}
              />
              <Typography
                textAlign="center"
                variant="subtitle1"
                color="text.secondary"
                component="span"
              >
                No Data
              </Typography>
            </Stack>
          )}
          {notFound && (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" paragraph>
                Not found
              </Typography>

              <Typography variant="body2">
                No results found for &nbsp;
                <strong>&quot;{searchTerm}&quot;</strong>.
                <br /> Try checking for typos or using complete words.
              </Typography>
            </Box>
          )}
        </Scrollbar>
      </Dialog>

      {/* Alert Box */}
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
              router.push('/sales_management/proforma_invoice/list');
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
