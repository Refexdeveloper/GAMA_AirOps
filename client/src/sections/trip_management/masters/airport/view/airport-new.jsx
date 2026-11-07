import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useMemo, useState, useEffect, forwardRef } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Link,
  Card,
  Stack,
  Slide,
  Dialog,
  Button,
  Divider,
  Checkbox,
  Container,
  TextField,
  FormLabel,
  FormGroup,
  Typography,
  IconButton,
  Breadcrumbs,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { FIndian } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import MapComponent from '../MapComponent';
import { getCoordinatesFromNominatim } from '../utils';

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

  const [airport, setAirport] = useState({
    airport_name: '',
    iata_code: '',
    icao_code: '',
    airport_handling_charge: 0,
    ground_handling_charge: 0,
    city_id: null,
    country_id:null,
    latitude: null,
    longitude: null,
    address: null,
    remark: null,
    critical_airport: 0,
    alertable_airport: 0,
  });
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState([]);
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [countryRes, cityRes] = await Promise.all([
        axios.get('/api/get_all_country'),
        axios.get('/api/all_cities'),
      ]);
      setCountry(countryRes.data);
      setCities(cityRes.data.results);
    } catch (error) {
      setCountry([]);
      setCities([]);
    }
  };

  fetchInitialData();
}, []);

  const handleInputChange = (field, value) => {
    setAirport((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const handleInputChangeCity = async (value) => {
    const updatedAirportData = { ...airport };
    updatedAirportData.city_id = value.id;
    if (value && cities.length > 0) {
      const selectedCity = cities?.find((_city) => _city.id === value.id);
   
      const cityLatLong = await getCoordinatesFromNominatim(selectedCity.city_name);
      setLatitude(cityLatLong.latitude);
      setLongitude(cityLatLong.longitude);
     
      updatedAirportData.latitude = cityLatLong.latitude
      updatedAirportData.country_id = selectedCity.country_id

      updatedAirportData.longitude = cityLatLong.longitude;

    setAirport(updatedAirportData);

    } else {
      setLatitude('');
      setLongitude('');
      setCountry('');
      updatedAirportData.latitude = null;
      updatedAirportData.longitude = null;
    setAirport(updatedAirportData);

    }
  };

  const validateData = () => {
    const errors = {};
    if (!airport.airport_name) errors.airport_name = 'Airport Name is requires.';
    if (!airport.iata_code) errors.iata_code = 'IATA Code is requires';
    if (!airport.icao_code) errors.icao_code = 'ICAO Code is requires.';
    if (!airport.city_id) errors.city_id = 'City is required';
    if (!airport.latitude) errors.latitude = 'Latitude is required';
    if (!airport.longitude) errors.longitude = 'Longitude is required';
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
        .post('/api/airport', airport)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/trip_management/masters/airport/list');
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

  const mapLngLat = useMemo(
    () => ({
      name: airport.name,
      coordinates: [airport.longitude, airport.latitude],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [airport.latitude, airport.longitude]
  );

  const breadcrumbs = [
    <Link key="1" underline="hover" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Link key="2" underline="hover" color="inherit" href="/trip_management/masters/airport">
      Airport
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;Airport
    </Typography>,
  ];

   console.log("airport.city_id",airport.city_id)
  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Create&nbsp;a&nbsp;new&nbsp;airport
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
                  Airport Details :
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid xs={12} md={7}>
                  <Grid container spacing={{ xs: 1, md: 3 }} columns={{ xs: 12, md: 7 }}>
                    <Grid xs={12} md={7}>
                      <TextField
                        size="small"
                        fullWidth
                        required
                        label="Airport Name"
                        value={airport.airport_name}
                        onChange={(event) => {
                          handleInputChange('airport_name', event.target.value);
                        }}
                        error={Boolean(validationErrors.airport_name)}
                        helperText={validationErrors.airport_name}
                      />
                    </Grid>
                    <Grid xs={6} md={3.5}>
                      <TextField
                        size="small"
                        fullWidth
                        required
                        label="IATA Code"
                        value={airport.iata_code}
                        onChange={(event) => {
                          handleInputChange('iata_code', event.target.value);
                        }}
                        error={Boolean(validationErrors.iata_code)}
                        helperText={validationErrors.iata_code}
                      />
                    </Grid>
                    <Grid xs={6} md={3.5}>
                      <TextField
                        size="small"
                        fullWidth
                        required
                        label="IACO Code"
                        value={airport.icao_code}
                        onChange={(event) => {
                          handleInputChange('icao_code', event.target.value);
                        }}
                        error={Boolean(validationErrors.icao_code)}
                        helperText={validationErrors.icao_code}
                      />
                    </Grid>
                    <Grid xs={6} md={3.5}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Airport Handling Charge"
                        InputProps={{
                          inputMode: 'numeric',
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        value={FIndian(airport.airport_handling_charge)}
                        onChange={(event) => {
                          const { value } = event.target;
                          let numericValue = value.replace(/[^\d.]/g, '');
                          if (numericValue === '') {
                            handleInputChange('airport_handling_charge', 0);
                          } else if (/^\d*\.?\d*$/.test(numericValue)) {
                            numericValue = numericValue.replace(/^0+(?=\d)/, '');
                            handleInputChange('airport_handling_charge', Number(numericValue));
                          }
                        }}
                        error={Boolean(validationErrors.airport_handling_charge)}
                        helperText={validationErrors.airport_handling_charge}
                      />
                    </Grid>
                    <Grid xs={6} md={3.5}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Ground Handling Charge"
                        InputProps={{
                          inputMode: 'numeric',
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        value={FIndian(airport.ground_handling_charge)}
                        onChange={(event) => {
                          const { value } = event.target;
                          let numericValue = value.replace(/[^\d.]/g, '');
                          if (numericValue === '') {
                            handleInputChange('ground_handling_charge', 0);
                          } else if (/^\d*\.?\d*$/.test(numericValue)) {
                            numericValue = numericValue.replace(/^0+(?=\d)/, '');
                            handleInputChange('ground_handling_charge', Number(numericValue));
                          }
                        }}
                        error={Boolean(validationErrors.ground_handling_charge)}
                        helperText={validationErrors.ground_handling_charge}
                      />
                    </Grid>
                    <Grid xs={12} md={3.5}>
                      <Grid container spacing={1} columns={{ xs: 12, md: 3.5 }}>
                        <Grid xs={12} md={3.2}>
                          {/* <Autocomplete
                              disableClearable
                              size="small"
                              options={cities}
                              getOptionLabel={(option) => option.name || ''}
                              value={airport.city_id||""}
                              onChange={(event, value) => handleInputChange('city_id', value?.id || '')}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="City"
                            
                              
                                />
                              )}
                            /> */}
                     <Autocomplete
   // optional controlled input
   value={cities.find((c) => c.id === airport.city_id) || null}
                              onChange={(event, value) => handleInputChangeCity(value)}
  getOptionLabel={(option) => option.city_name || ''}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  id="combo-box-city"
  size="small"
  options={Array.isArray(cities) ? cities : []}
  renderInput={(params) => (
    <TextField
      {...params}
      required
      label="City"
    />
  )}
  noOptionsText={
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 1,
      }}
    >
      {/* <Typography variant="body2">No cities found</Typography> */}
      <Button
        size="small"
         variant="contained"
        onClick={() => router.push('/trip_management/masters/city/new')}
      >
        + Add City  
      </Button>
    </Box>
  }
/>

                        </Grid>
                        {/* <Grid item xs={2} md={0.5}>
                          <Tooltip title="New City">
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => {
                                router.push('/trip_management/masters/city/list');
                                handleClickAlert();
                              }}
                            >
                              <Iconify icon="eva:chevron-right-fill" />
                            </Button>
                          </Tooltip>
                        </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid xs={12} md={3.5}>
                                        <Autocomplete
   // optional controlled input
   value={country.find((c) => c.id === airport.country_id) || null}
                              onChange={(event, value) => handleInputChange('country_id', value?.id || '')}
  getOptionLabel={(option) => option.name || ''}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  id="combo-box-city"
  size="small"
  options={Array.isArray( country) ? country : []}
  renderInput={(params) => (
    <TextField
      {...params}
      required
      label="Country"
    />
  )}
  noOptionsText={
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 1,
      }}
    >
      {/* <Typography variant="body2">No cities found</Typography> */}
      <Button
        size="small"
         variant="contained"
        onClick={() => router.push('/trip_management/masters/country/new')}
      >
        + Add Country  
      </Button>
    </Box>
  }
/>
                      {/* <TextField disabled value={country} size="small" fullWidth label="Country" /> */}
                    </Grid>
                    <Grid xs={12} md={7}>
                      <Grid container spacing={1.5} columns={{ xs: 12, md: 7 }}>
                        <Grid xs={12} md={7}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Note: Latitude / Longitude should be in decimal format only. (Ex:
                            23.022505)
                          </Typography>
                        </Grid>
                        <Grid xs={6} md={3.5}>
                          <TextField
                            required
                            id="latitude"
                            size="small"
                            label="Latitude"
                            value={latitude}
                            onChange={(event) => {
                              setLatitude(event.target.value);
                            }}
                            onBlur={(event) => {
                              setLatitude(event.target.value);
                              handleInputChange('latitude', event.target.value);
                            }}
                            error={Boolean(validationErrors.latitude)}
                            helperText={validationErrors.latitude}
                          />
                        </Grid>
                        <Grid xs={6} md={3.5}>
                          <TextField
                            required
                            id="longitude"
                            size="small"
                            label="Longitude"
                            value={longitude}
                            onChange={(event) => {
                              setLongitude(event.target.value);
                            }}
                            onBlur={(event) => {
                              setLongitude(event.target.value);
                              handleInputChange('longitude', event.target.value);
                            }}
                            error={Boolean(validationErrors.longitude)}
                            helperText={validationErrors.longitude}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        id="address"
                        label="Address"
                        placeholder="Address"
                        multiline
                        rows={2}
                        value={airport.address}
                        onChange={(event) => {
                          if (event.target.value) {
                            handleInputChange('address', event.target.value);
                          } else {
                            handleInputChange('address', null);
                          }
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        id="remarks"
                        label="Remarks"
                        placeholder="Some remarks"
                        multiline
                        rows={2}
                        value={airport.remark}
                        onChange={(event) => {
                          if (event.target.value) {
                            handleInputChange('remark', event.target.value);
                          } else {
                            handleInputChange('remark', null);
                          }
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Airport Type :</FormLabel>
                        <FormGroup aria-label="position" row>
                          <FormControlLabel
                            value="top"
                            control={
                              <Checkbox
                                checked={airport.critical_airport}
                                onChange={(e) =>
                                  handleInputChange('critical_airport', !airport.critical_airport)
                                }
                              />
                            }
                            label="Critical Airport"
                          />
                          <FormControlLabel
                            value="start"
                            control={
                              <Checkbox
                                checked={airport.alertable_airport}
                                onChange={(e) =>
                                  handleInputChange('alertable_airport', !airport.alertable_airport)
                                }
                              />
                            }
                            label="Alertable Airport"
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={12} md={5}>
                  {airport.latitude && airport.longitude ? (
                    <Box sx={{ borderRadius: 1, height: '100%', overflow: 'hidden' }}>
                      <MapComponent mapLngLat={mapLngLat} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Stack>
                        <Box
                          component="img"
                          src="/assets/illustrations/map_preview.svg"
                          sx={{
                            height: 200,
                            mx: 'auto',
                          }}
                        />
                        <Typography variant="h5" textAlign="center">
                          Map Preview
                        </Typography>
                      </Stack>
                    </Box>
                  )}
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
                router.push('/trip_management/masters/airport/list');
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
              router.push('/trip_management/masters/airport/list');
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
