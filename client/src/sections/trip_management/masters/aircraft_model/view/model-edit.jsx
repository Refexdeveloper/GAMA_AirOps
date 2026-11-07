/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useState, useEffect, forwardRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Link,
  Card,
  Stack,
  Slide,
  Radio,
  Button,
  Dialog,
  styled,
  Divider,
  Container,
  TextField,
  FormLabel,
  Typography,
  IconButton,
  RadioGroup,
  Breadcrumbs,
  DialogTitle,
  FormControl,
  Autocomplete,
  ListItemText,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { FIndian } from 'src/utils/format-number';

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

const MANUFACTURERS = [
  { label: 'Airbus', value: 'Airbus' },
  { label: 'Textron', value: 'Textron' },
  { label: 'Boeing', value: 'Boeing' },
  { label: 'Bombardier', value: 'Bombardier' },
  { label: 'Cessna', value: 'Cessna' },
  { label: 'Pilatus', value: 'Pilatus' },
];

const AIRCRAFT_TYPES = [
  'Turbo Prop',
  'Light Jet',
  'Midsize Jet',
  'Super Midsize Jet',
  'Large Jet',
  'Helicopter',
  'Airliner',
];

const WING_TYPES = ['Fixed Wing', 'Retractable Wing', 'Rotary Wing'];

export default function EditPage() {
  const { modelId } = useParams();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [model, setModel] = useState({
    aircraft_manufacture: '',
    aircraft_model: '',
    aircraft_type: '',
    wing_type: '',
    period_of_manufacture: '',
    aircraft_per_hour_cost: 0,
    base_location: 0,
    aircraft_attendant_availability: false,
    wifi_availability: false,
    satellite_phone: false,
    lavatory: false,
    pilots: 0,
    seats: 0,
    baggages_capacity: 0,
    max_ceiling: 0,
    cabin_height: 0,
    cabin_width: 0,
    cabin_length: 0,
    length: 0,
    height: 0,
    wingspan: 0,
    empty_weight: 0,
    max_take_of_weight: 0,
    max_payload: 0,
    fuel_capacity: 0,
    engine: 0,
    engine_model: '',
    max_cruising_speed: 0,
    runway_length: 0,
    range: 0,
    images: null,
    aircraft: [],
    lopa: [],
    cabin: [],
    interior: [],
  });
  const [initialImages, setInitialImages] = useState({
    aircraft: true,
    lopa: true,
    cabin: true,
    interior: true,
  });
  const [airportsList, setAirportList] = useState([
    {
      airport_id: 0,
      airport_city: '',
      airport_name: '',
      coordinates: ['0.00', '0.00'],
    },
  ]);
  const [validationErrors, setValidationErrors] = useState({});
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  console.log(model);

  useEffect(() => {
    const fetchAirportsList = async () => {
      try {
        await axios.get('/api/airports').then((response) => {
          setAirportList(response.data);
          console.log(response.data);
        });
      } catch (error) {
        setAirportList([]);
      }
    };

    const fetchData = async () => {
      try {
        await axios.get(`/api/aircraft_models/${modelId}`).then((response) => {
          setModel(response.data.results);
          setInitialImages({
            aircraft: true,
            lopa: true,
            cabin: true,
            interior: true,
          });
          // console.log(response.data.results);
        });
      } catch (error) {
        setAirportList([]);
      }
    };
    fetchAirportsList();
    fetchData();
  }, [modelId]);

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const renderImagePreviews = (field, images) =>
    images.map((image, index) => (
      <Box key={index} p="5px">
        {image && (
          <img
            src={initialImages[field] ? image : URL.createObjectURL(image)}
            alt="preview"
            // style={{ width: '100px', height: '100px', margin: '5px' }}
          />
        )}
      </Box>
    ));

  const handleInputChange = (field, value) => {
    if (field === 'aircraft' || field === 'interior' || field === 'lopa' || field === 'cabin') {
      setInitialImages((prev) => ({ ...prev, [field]: false }));
    }
    setModel((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const handleInputChangeDecimal = (event, field) => {
    const { value } = event.target;
    if (value === '') {
      handleInputChange(field, 0);
    } else if (/^\d*\.?\d*$/.test(value)) {
      handleInputChange(field, value.replace(/^0+(?=\d)/, ''));
    }
  };

  const handleInputBlurDecimal = (field) => {
    const parsedValue = parseFloat(model[field]);
    handleInputChange(field, parsedValue);
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    const limits = {
      aircraft: 3,
      lopa: 1,
      cabin: 1,
      interior: 3,
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

    if (!model.aircraft_model) errors.aircraft_model = 'Model Name is required.';
    if (!model.aircraft_manufacture)
      errors.aircraft_manufacture = 'Model Manufacturer is required.';
    if (!model.aircraft_type) errors.aircraft_type = 'Model Type is required';
    if (!model.wing_type) errors.wing_type = 'Wing Type is required';
    if (!model.period_of_manufacture)
      errors.period_of_manufacture = 'Period of manufacture is required';
    if (!model.aircraft_per_hour_cost)
      errors.aircraft_per_hour_cost = 'Aircraft per hour cost is required.';
    if (!model.pilots) errors.pilots = 'Number of pilots is required.';
    if (!model.seats) errors.seats = 'Number of seats is required.';
    if (!model.baggages_capacity) errors.baggages_capacity = 'Baggages Capacity is required.';
    if (!model.max_ceiling) errors.max_ceiling = 'Max ceiling is required.';
    if (!model.cabin_height) errors.cabin_height = 'Cabin Height is required.';
    if (!model.cabin_width) errors.cabin_width = 'Cabin Width is required';
    if (!model.cabin_length) errors.cabin_length = 'Cabin Length is required';
    if (!model.length) errors.length = 'Length is required.';
    if (!model.height) errors.height = 'Height is required.';
    if (!model.wingspan) errors.wingspan = 'Wingspan is required.';
    if (!model.empty_weight) errors.empty_weight = 'Empty weight is required.';
    if (!model.max_take_of_weight) errors.max_take_of_weight = 'Max take of weight is required.';
    if (!model.max_payload) errors.max_payload = 'Max payload is required.';
    if (!model.fuel_capacity) errors.fuel_capacity = 'Fuel capacity is required.';
    if (!model.engine) errors.engine = 'Number of engine is required.';
    if (!model.engine_model) errors.engine_model = 'Engine Model is required.';
    if (!model.max_cruising_speed) errors.max_cruising_speed = 'Max cruising speed is required.';
    if (!model.runway_length) errors.runway_length = 'Runway length is required.';
    if (!model.range) errors.range = 'Range is required.';
    if (model.aircraft.length < 1 || model.aircraft.length > 3)
      errors.aircraft = 'Please select 1 to 3 aircraft images.';
    if (model.lopa.length !== 1) errors.lopa = 'Please select exactly 1 lopa image.';
    if (model.cabin.length !== 1) errors.cabin = 'Please select exactly 1 cabin image.';
    if (model.interior.length < 1 || model.interior.length > 3)
      errors.interior = 'Please select 1 to 3 interior images.';

    return errors;
  };

  const handleSubmit = async (event) => {
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      const formData = new FormData();

      formData.append('aircraft_model', model.aircraft_model);
      formData.append('aircraft_manufacture', model.aircraft_manufacture);
      formData.append('aircraft_type', model.aircraft_type);
      formData.append('wing_type', model.wing_type);
      formData.append('period_of_manufacture', model.period_of_manufacture);
      formData.append('aircraft_per_hour_cost', model.aircraft_per_hour_cost);
      formData.append('base_location', model.base_location || '');
      formData.append('aircraft_attendant_availability', model.aircraft_attendant_availability);
      formData.append('wifi_availability', model.wifi_availability);
      formData.append('satellite_phone', model.satellite_phone);
      formData.append('lavatory', model.lavatory);
      formData.append('pilots', model.pilots);
      formData.append('seats', model.seats);
      formData.append('engine', model.engine);
      formData.append('engine_model', model.engine_model);
      formData.append('fuel_capacity', model.fuel_capacity);
      formData.append('empty_weight', model.empty_weight);
      formData.append('baggages_capacity', model.baggages_capacity);
      formData.append('max_payload', model.max_payload);
      formData.append('max_take_of_weight', model.max_take_of_weight);
      formData.append('runway_length', model.runway_length);
      formData.append('length', model.length);
      formData.append('height', model.height);
      formData.append('wingspan', model.wingspan);
      formData.append('cabin_length', model.cabin_length);
      formData.append('cabin_height', model.cabin_height);
      formData.append('cabin_width', model.cabin_width);
      formData.append('max_ceiling', model.max_ceiling);
      formData.append('range', model.range);
      formData.append('max_cruising_speed', model.max_cruising_speed);
      // Append aircraft images
      if (!initialImages.aircraft) {
        model.aircraft.forEach((file) => {
          formData.append('aircraft', file);
        });
      }

      // Append lopa images
      if (!initialImages.lopa) {
        model.lopa.forEach((file) => {
          formData.append('lopa', file);
        });
      }

      // Append cabin images
      if (!initialImages.cabin) {
        model.cabin.forEach((file) => {
          formData.append('cabin', file);
        });
      }

      // Append interior images
      if (!initialImages.interior) {
        model.interior.forEach((file) => {
          formData.append('interior', file);
        });
      }

      await axios
        .put(`/api/aircraft_models/${modelId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            router.push('/trip_management/masters/aircraft_models/list');
            enqueueSnackbar(response.data.message, {
              variant: response.data.status ? 'success' : 'error',
              action,
            });
          }
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.message, { variant: 'error', action });
        });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', action });
    }
  };

  const handleClickAlert = () => {
    setOpenAlert(!openAlert);
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Link key="3" underline="hover" color="inherit" href="/trip_management/masters/aircraft_models">
      Aircraft&nbsp;Model
    </Link>,
    <Typography key="4" color="text.disabled">
      {model.aircraft_model}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Edit
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
      <Card>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Aircraft Model Details :
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  id="model_name"
                  fullWidth
                  required
                  // size="small"
                  label="Model Name"
                  value={model.aircraft_model}
                  onChange={(event) => {
                    handleInputChange('aircraft_model', event.target.value);
                  }}
                  error={Boolean(validationErrors.aircraft_model)}
                  helperText={validationErrors.aircraft_model}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <Autocomplete
                  id="model_manufacturer"
                  fullWidth
                  value={
                    MANUFACTURERS.find((_M) => _M.value === model.aircraft_manufacture) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange('aircraft_manufacture', newValue ? newValue.value : null);
                  }}
                  options={MANUFACTURERS}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Model Manufacturer"
                      placeholder="Select Manufacturer..."
                      error={Boolean(validationErrors.aircraft_manufacture)}
                      helperText={validationErrors.aircraft_manufacture}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <Autocomplete
                  id="model_type"
                  fullWidth
                  value={model.aircraft_type}
                  onChange={(event, newValue) => {
                    if (newValue) handleInputChange('aircraft_type', newValue);
                    else handleInputChange('aircraft_type', null);
                  }}
                  options={AIRCRAFT_TYPES}
                  // getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Model Type"
                      placeholder="Select Type..."
                      error={Boolean(validationErrors.aircraft_type)}
                      helperText={validationErrors.aircraft_type}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <Autocomplete
                  id="wing_type"
                  fullWidth
                  value={model.wing_type}
                  onChange={(event, newValue) => {
                    if (newValue) handleInputChange('wing_type', newValue);
                    else handleInputChange('wing_type', null);
                  }}
                  options={WING_TYPES}
                  // getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Wing Type"
                      placeholder="Select Wing Type..."
                      error={Boolean(validationErrors.wing_type)}
                      helperText={validationErrors.wing_type}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  id="period_of_manufacture"
                  fullWidth
                  required
                  // size="small"
                  label="Period of manufacture"
                  value={model.period_of_manufacture}
                  onChange={(event) => {
                    handleInputChange('period_of_manufacture', event.target.value);
                  }}
                  error={Boolean(validationErrors.period_of_manufacture)}
                  helperText={validationErrors.period_of_manufacture}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  id="per_hour_cost"
                  fullWidth
                  required
                  label="Aircraft per hour cost"
                  value={FIndian(model.aircraft_per_hour_cost)}
                  onChange={(event) => {
                    const { value } = event.target;
                    let numericValue = value.replace(/[^\d.]/g, '');
                    if (numericValue === '') {
                      handleInputChange('aircraft_per_hour_cost', 0);
                    } else if (/^\d*\.?\d*$/.test(numericValue)) {
                      numericValue = numericValue.replace(/^0+(?=\d)/, '');
                      handleInputChange('aircraft_per_hour_cost', Number(numericValue));
                    }
                  }}
                  InputProps={{
                    inputMode: 'numeric',
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  error={Boolean(validationErrors.aircraft_per_hour_cost)}
                  helperText={validationErrors.aircraft_per_hour_cost}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <Autocomplete
                  id="base_location"
                  fullWidth
                  value={airportsList.find((_al) => _al.airport_id === model.base_location || null)}
                  onChange={(event, newValue) => {
                    if (newValue) handleInputChange('base_location', newValue.airport_id);
                    else handleInputChange('base_location', null);
                  }}
                  options={airportsList}
                  getOptionLabel={(option) => option.airport_name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Base Airport"
                      placeholder="Select Base Location..."
                      error={Boolean(validationErrors.base_location)}
                      helperText={validationErrors.base_location}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3} />
              <Grid xs={12} sm={4} md={3}>
                <FormControl>
                  <FormLabel id="aircraft_attendant_availability">Attendant Availability</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="aircraft_attendant_availability"
                    name="aircraft_attendant_availability"
                    value={model.aircraft_attendant_availability ? 'yes' : 'no'}
                    onChange={(e) =>
                      handleInputChange('aircraft_attendant_availability', e.target.value === 'yes')
                    }
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <FormControl>
                  <FormLabel id="wifi_availability">WiFi Availability</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="wifi_availability"
                    name="wifi_availability"
                    value={model.wifi_availability ? 'yes' : 'no'}
                    onChange={(e) =>
                      handleInputChange('wifi_availability', e.target.value === 'yes')
                    }
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <FormControl>
                  <FormLabel id="satellite_phone">Satellite Phone Availability</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="satellite_phone"
                    name="satellite_phone"
                    value={model.satellite_phone ? 'yes' : 'no'}
                    onChange={(e) => handleInputChange('satellite_phone', e.target.value === 'yes')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <FormControl>
                  <FormLabel id="lavatory">Lavatory Availability</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="lavatory"
                    name="lavatory"
                    value={model.lavatory ? 'yes' : 'no'}
                    onChange={(e) => handleInputChange('lavatory', e.target.value === 'yes')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Specification Details :
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="pilots"
                  fullWidth
                  required
                  size="small"
                  label="No.of. Pilots"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={model.pilots}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(
                        'pilots',
                        value === '' ? 0 : value.replace(/^0+(?=\d)/, '')
                      );
                    }
                  }}
                  error={Boolean(validationErrors.pilots)}
                  helperText={validationErrors.pilots}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="seats"
                  fullWidth
                  required
                  size="small"
                  label="No.of. Seats"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={model.seats}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(
                        'seats',
                        value === '' ? '0' : value.replace(/^0+(?=\d)/, '')
                      );
                    }
                  }}
                  error={Boolean(validationErrors.seats)}
                  helperText={validationErrors.seats}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="engine"
                  fullWidth
                  required
                  size="small"
                  label="No.of. Engines"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={model.engine}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(
                        'engine',
                        value === '' ? '0' : value.replace(/^0+(?=\d)/, '')
                      );
                    }
                  }}
                  error={Boolean(validationErrors.engine)}
                  helperText={validationErrors.engine}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="engine_model"
                  fullWidth
                  required
                  size="small"
                  label="Engine Model"
                  value={model.engine_model}
                  onChange={(event) => {
                    handleInputChange('engine_model', event.target.value);
                  }}
                  error={Boolean(validationErrors.engine_model)}
                  helperText={validationErrors.engine_model}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="runway_length"
                  fullWidth
                  required
                  size="small"
                  label="Runway Length"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.runway_length}
                  onChange={(event) => handleInputChangeDecimal(event, 'runway_length')}
                  onBlur={() => handleInputBlurDecimal('runway_length')}
                  error={Boolean(validationErrors.runway_length)}
                  helperText={validationErrors.runway_length}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="fuel_capacity"
                  fullWidth
                  required
                  size="small"
                  label="Fuel Capacity"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={model.fuel_capacity}
                  onChange={(event) => handleInputChangeDecimal(event, 'fuel_capacity')}
                  onBlur={() => handleInputBlurDecimal('fuel_capacity')}
                  error={Boolean(validationErrors.fuel_capacity)}
                  helperText={validationErrors.fuel_capacity}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="empty_weight"
                  fullWidth
                  required
                  size="small"
                  label="Empty Weight"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={model.empty_weight}
                  onChange={(event) => handleInputChangeDecimal(event, 'empty_weight')}
                  onBlur={() => handleInputBlurDecimal('empty_weight')}
                  error={Boolean(validationErrors.empty_weight)}
                  helperText={validationErrors.empty_weight}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="baggages_capacity"
                  fullWidth
                  required
                  size="small"
                  label="Baggages Capacity"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={model.baggages_capacity}
                  onChange={(event) => handleInputChangeDecimal(event, 'baggages_capacity')}
                  onBlur={() => handleInputBlurDecimal('baggages_capacity')}
                  error={Boolean(validationErrors.baggages_capacity)}
                  helperText={validationErrors.baggages_capacity}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="max_payload"
                  fullWidth
                  required
                  size="small"
                  label="Max Payload"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={model.max_payload}
                  onChange={(event) => handleInputChangeDecimal(event, 'max_payload')}
                  onBlur={() => handleInputBlurDecimal('max_payload')}
                  error={Boolean(validationErrors.max_payload)}
                  helperText={validationErrors.max_payload}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="max_take_of_weight"
                  fullWidth
                  required
                  size="small"
                  label="Max Take Off Weight"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  value={model.max_take_of_weight}
                  onChange={(event) => handleInputChangeDecimal(event, 'max_take_of_weight')}
                  onBlur={() => handleInputBlurDecimal('max_take_of_weight')}
                  error={Boolean(validationErrors.max_take_of_weight)}
                  helperText={validationErrors.max_take_of_weight}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="length"
                  fullWidth
                  required
                  size="small"
                  label="Aircraft Length"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.length}
                  onChange={(event) => handleInputChangeDecimal(event, 'length')}
                  onBlur={() => handleInputBlurDecimal('length')}
                  error={Boolean(validationErrors.length)}
                  helperText={validationErrors.length}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="height"
                  fullWidth
                  required
                  size="small"
                  label="Aircraft Height"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.height}
                  onChange={(event) => handleInputChangeDecimal(event, 'height')}
                  onBlur={() => handleInputBlurDecimal('height')}
                  error={Boolean(validationErrors.height)}
                  helperText={validationErrors.height}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="wingspan"
                  fullWidth
                  required
                  size="small"
                  label="Aircraft Wingspan"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.wingspan}
                  onChange={(event) => handleInputChangeDecimal(event, 'wingspan')}
                  onBlur={() => handleInputBlurDecimal('wingspan')}
                  error={Boolean(validationErrors.wingspan)}
                  helperText={validationErrors.wingspan}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="cabin_length"
                  fullWidth
                  required
                  size="small"
                  label="Cabin Length"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.cabin_length}
                  onChange={(event) => handleInputChangeDecimal(event, 'cabin_length')}
                  onBlur={() => handleInputBlurDecimal('cabin_length')}
                  error={Boolean(validationErrors.cabin_length)}
                  helperText={validationErrors.cabin_length}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="cabin_height"
                  fullWidth
                  required
                  size="small"
                  label="Cabin Height"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.cabin_height}
                  onChange={(event) => handleInputChangeDecimal(event, 'cabin_height')}
                  onBlur={() => handleInputBlurDecimal('cabin_height')}
                  error={Boolean(validationErrors.cabin_height)}
                  helperText={validationErrors.cabin_height}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="cabin_width"
                  fullWidth
                  required
                  size="small"
                  label="Cabin Width"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.cabin_width}
                  onChange={(event) => handleInputChangeDecimal(event, 'cabin_width')}
                  onBlur={() => handleInputBlurDecimal('cabin_width')}
                  error={Boolean(validationErrors.cabin_width)}
                  helperText={validationErrors.cabin_width}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="max_ceiling"
                  fullWidth
                  required
                  size="small"
                  label="Max Ceiling"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                  }}
                  value={model.max_ceiling}
                  onChange={(event) => handleInputChangeDecimal(event, 'max_ceiling')}
                  onBlur={() => handleInputBlurDecimal('max_ceiling')}
                  error={Boolean(validationErrors.max_ceiling)}
                  helperText={validationErrors.max_ceiling}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="range"
                  fullWidth
                  required
                  size="small"
                  label="Aircraft Range"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">nm</InputAdornment>,
                  }}
                  value={model.range}
                  onChange={(event) => handleInputChangeDecimal(event, 'range')}
                  onBlur={() => handleInputBlurDecimal('range')}
                  error={Boolean(validationErrors.range)}
                  helperText={validationErrors.range}
                />
              </Grid>
              <Grid xs={6} sm={3} md={2.4}>
                <TextField
                  id="max_cruising_speed"
                  fullWidth
                  required
                  size="small"
                  label="Max Cruising Speed"
                  InputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*[.]?[0-9]*',
                    endAdornment: <InputAdornment position="end">kn</InputAdornment>,
                  }}
                  value={model.max_cruising_speed}
                  onChange={(event) => handleInputChangeDecimal(event, 'max_cruising_speed')}
                  onBlur={() => handleInputBlurDecimal('max_cruising_speed')}
                  error={Boolean(validationErrors.max_cruising_speed)}
                  helperText={validationErrors.max_cruising_speed}
                />
              </Grid>
            </Grid>
          </Box>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Aircraft Model Images :
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} md={3}>
                <Box>
                  <ListItemText
                    primary="Aircraft"
                    secondary="Please select three aircraft images."
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
                  <Box mt={1}>{renderImagePreviews('aircraft', model.aircraft)}</Box>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box>
                  <ListItemText
                    primary="Interior"
                    secondary="Please select three interior images."
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
                  <Box mt={1}>{renderImagePreviews('interior', model.interior)}</Box>
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
                  <Box mt={1}>{renderImagePreviews('lopa', model.lopa)}</Box>
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
                  <Box mt={1}>{renderImagePreviews('cabin', model.cabin)}</Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Card>
      <Grid container justifyContent="flex-end" spacing={3} pt={3}>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={handleSubmit}
            variant="outlined"
            color="success"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Save
          </Button>
        </Grid>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={() => {
              if (changeMade) {
                handleClickAlert();
              } else {
                router.push('/trip_management/masters/aircraft_models/list');
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
              router.push('/trip_management/masters/aircraft_models/list');
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
