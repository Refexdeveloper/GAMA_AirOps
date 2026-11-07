import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Link,
  Card,
  Stack,
  Slide,
  Button,
  Dialog,
  Switch,
  Divider,
  Tooltip,
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
  DialogActions,
  DialogContent,
  InputAdornment,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const TimeFormats = ['Local Time', 'UTC'];
const Units = ['Kilo Grams', 'Pounds'];

export default function NewPage() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [operators, setOperators] = useState([]);
  const [models, setModels] = useState([]);
  const [aircraft, setAircraft] = useState({
    operator_id: 1,
    model_id: null,
    reg_no: '',
    min_cabin_crew: 0,
    min_flight_crew: 0,
    no_of_captain: 0,
    no_of_fo: 0,
    no_of_fe: 0,
    c_cls_capacity: 0,
    y_cls_capacity: 0,
    seating_capacity: 0,
    time_format: null,
    // local_time: 0,
    // utc_time: 0,
    block_opening_hrs: '00:00:00',
    time_in_air_opening_hrs: '00:00:00',
    not_in_service: false,
    not_in_service_from: null,
    cruising_speed: 0,
    freight_capacity: 0.0,
    unit: null,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        await axios.get('/api/list_aircraft_models').then((response) => {
          // console.log(response.data);
          setModels(response.data.results);
        });
      } catch (error) {
        setModels([]);
      }
    };
    const fetchOperators = async () => {
      try {
        await axios.get('/api/list-of-operators').then((response) => {
          // console.log(response.data);
          setOperators(response.data);
        });
      } catch (error) {
        setOperators([]);
      }
    };
    fetchOperators();
    fetchModels();
  }, []);

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const handleInputChange = (field, value) => {
    setAircraft((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const validateData = () => {
    const errors = {};

    if (!aircraft.model_id) errors.model_id = 'Model is required.';
    if (!aircraft.operator_id) errors.operator_id = 'Operator is required.';
    if (!aircraft.reg_no) errors.reg_no = 'Registration number is required.';
    if (!aircraft.min_flight_crew) errors.min_flight_crew = 'Minimum flight crew is required';
    if (!aircraft.time_format) errors.time_format = 'Time Format is required';
    if (!aircraft.cruising_speed) errors.cruising_speed = 'Cruising Speed is required';
    if (aircraft.freight_capacity) {
      if (!aircraft.unit) errors.unit = 'Unit is required';
    }
    if (aircraft.not_in_service) {
      if (!aircraft.not_in_service_from) errors.not_in_service_from = 'Please provide the date';
    }
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
        .post('/api/aircrafts', aircraft)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/trip_management/masters/aircrafts/list');
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
    <Link underline="hover" key="1" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Link key="3" underline="hover" color="inherit" href="/trip_management/masters/aircrafts">
      Aircraft
    </Link>,
    <Typography key="4" color="text.disabled">
      New&nbsp;Aircraft
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Create&nbsp;a&nbsp;new&nbsp;aircraft
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

      <Card>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Aircraft Details :
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid xs={4} sm={6} md={6}>
                <Autocomplete
                  disabled
                  value={operators.find((_op) => _op.id === aircraft.operator_id) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleInputChange('operator_id', newValue.id);
                    } else {
                      handleInputChange('operator_id', null);
                    }
                  }}
                  options={operators}
                  getOptionLabel={(option) => option.operator_name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Operator"
                      variant="filled"
                      size="small"
                      error={Boolean(validationErrors.operator_id)}
                      helperText={validationErrors.operator_id}
                    />
                  )}
                />
              </Grid>
              <Grid xs={false} sm={6} md={6} />
              <Grid xs={4} sm={6} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Reg. No:"
                  value={aircraft.reg_no}
                  onChange={(event) => {
                    handleInputChange('reg_no', event.target.value);
                  }}
                  error={Boolean(validationErrors.reg_no)}
                  helperText={validationErrors.reg_no}
                />
              </Grid>
              <Grid xs={4} sm={6} md={6}>
                <Stack direction="row" spacing={2}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    getOptionLabel={(option) =>
                      `${option.aircraft_model} (${option.aircraft_manufacture})`
                    }
                    value={models.find((_model) => _model.id === aircraft.model_id) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleInputChange('model_id', newValue.id);
                      } else {
                        handleInputChange('model_id', null);
                      }
                    }}
                    // inputValue={inputValue}
                    // onInputChange={(event, newInputValue) => {
                    //   setInputValue(newInputValue);
                    // }}
                    options={models}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Model"
                        error={Boolean(validationErrors.model_id)}
                        helperText={validationErrors.model_id}
                      />
                    )}
                  />
                  <Tooltip title="New Model">
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push('/trip_management/masters/aircraft_models/list');
                        handleClickAlert();
                      }}
                    >
                      <Iconify icon="material-symbols:add-rounded" />
                    </Button>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid xs={4} sm={6} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Min. Cabin Crew"
                  value={aircraft.min_cabin_crew}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('min_cabin_crew', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.min_cabin_crew)}
                  helperText={validationErrors.min_cabin_crew}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 2 }} // Helps mobile users
                />
              </Grid>

              <Grid xs={4} sm={6} md={6}>
                <TextField
                  required
                  size="small"
                  fullWidth
                  label="Min. Flight Crew"
                  value={aircraft.min_flight_crew}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('min_flight_crew', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.min_flight_crew)}
                  helperText={validationErrors.min_flight_crew}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 2 }} // Helps on mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="No. of Captain(s)"
                  value={aircraft.no_of_captain}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('no_of_captain', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.no_of_captain)}
                  helperText={validationErrors.no_of_captain}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 2 }} // Helps on mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="No. of FO(s)"
                  value={aircraft.no_of_fo}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('no_of_fo', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.no_of_fo)}
                  helperText={validationErrors.no_of_fo}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 2 }} // Helps on mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="No. of FE(s)"
                  value={aircraft.no_of_fe}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('no_of_fe', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.no_of_fe)}
                  helperText={validationErrors.no_of_fe}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 2 }} // Helps on mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="cCls Capacity"
                  value={aircraft.c_cls_capacity}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('c_cls_capacity', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.c_cls_capacity)}
                  helperText={validationErrors.c_cls_capacity}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 3 }} // Helps with mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="yCls Capacity"
                  value={aircraft.y_cls_capacity}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('y_cls_capacity', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.y_cls_capacity)}
                  helperText={validationErrors.y_cls_capacity}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 3 }} // Helps with mobile keyboards
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Seating Capacity"
                  value={aircraft.seating_capacity}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('seating_capacity', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.seating_capacity)}
                  helperText={validationErrors.seating_capacity}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 3 }} // Enforce numeric input
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <Autocomplete
                  size="small"
                  value={aircraft.time_format}
                  onChange={(event, newValue) => {
                    handleInputChange('time_format', newValue);
                  }}
                  options={TimeFormats}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Time Format"
                      error={Boolean(validationErrors.time_format)}
                      helperText={validationErrors.time_format}
                    />
                  )}
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Block Opening Hrs"
                  value={aircraft.block_opening_hrs}
                  onChange={(event) => {
                    let { value } = event.target;

                    // Allow only numbers and a colon
                    value = value.replace(/[^0-9:]/g, '');

                    // Validate format dynamically while allowing input
                    if (/^([0-9]{1,2}:?[0-5]?[0-9]?:?[0-5]?[0-9]?)?$/.test(value)) {
                      handleInputChange('block_opening_hrs', value);
                    }
                  }}
                  onBlur={() => {
                    // Final validation on blur
                    if (
                      !/^(?:[0-9]|[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                        aircraft.block_opening_hrs
                      )
                    ) {
                      handleInputChange('block_opening_hrs', '00:00:00');
                    }
                  }}
                  error={Boolean(validationErrors.block_opening_hrs)}
                  helperText={validationErrors.block_opening_hrs}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*:[0-9]*:[0-9]*',
                    maxLength: 8,
                  }}
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  label="Time In Air Opening Hrs"
                  value={aircraft.time_in_air_opening_hrs}
                  onChange={(event) => {
                    let { value } = event.target;

                    // Allow only numbers and a colon
                    value = value.replace(/[^0-9:]/g, '');

                    // Validate format dynamically while allowing input
                    if (/^([0-9]{1,2}:?[0-5]?[0-9]?:?[0-5]?[0-9]?)?$/.test(value)) {
                      handleInputChange('time_in_air_opening_hrs', value);
                    }
                  }}
                  onBlur={() => {
                    // Final validation on blur
                    if (
                      !/^(?:[0-9]|[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
                        aircraft.time_in_air_opening_hrs
                      )
                    ) {
                      handleInputChange('time_in_air_opening_hrs', '00:00:00');
                    }
                  }}
                  error={Boolean(validationErrors.time_in_air_opening_hrs)}
                  helperText={validationErrors.time_in_air_opening_hrs}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*:[0-9]*:[0-9]*',
                    maxLength: 8,
                  }}
                />
              </Grid>

              <Grid xs={4} sm={6} md={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Note: The cruising speed is used to calculate the trip charge in the quotation.
                </Typography>
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <TextField
                  required
                  size="small"
                  fullWidth
                  label="Cruising Speed"
                  value={aircraft.cruising_speed}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleInputChange('cruising_speed', numericValue ? Number(numericValue) : 0);
                  }}
                  error={Boolean(validationErrors.cruising_speed)}
                  helperText={validationErrors.cruising_speed}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 5 }} // Helps on mobile keyboards
                  InputProps={{
                    endAdornment: <InputAdornment position="start">kn</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid xs={4} sm={6} md={4}>
                <Box display="flex" justifyContent="center">
                  <TextField
                    sx={{ mr: 1 }}
                    size="small"
                    fullWidth
                    label="Freight Capacity"
                    value={aircraft.freight_capacity}
                    onChange={(event) => {
                      const numericValue = event.target.value;

                      // Allow only numbers and a single decimal point
                      if (/^\d*\.?\d*$/.test(numericValue)) {
                        handleInputChange(
                          'freight_capacity',
                          numericValue ? Number(numericValue) : 0
                        );
                      }
                    }}
                    error={Boolean(validationErrors.freight_capacity)}
                    helperText={validationErrors.freight_capacity}
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', maxLength: 10 }} // Enforce numeric input with decimal
                    InputProps={{
                      endAdornment: (() => {
                        let unitLabel = null;
                        if (aircraft.unit === 'Kilo Grams') {
                          unitLabel = 'kgs';
                        } else if (aircraft.unit === 'Pounds') {
                          unitLabel = 'lbs';
                        }
                        return <InputAdornment position="start">{unitLabel}</InputAdornment>;
                      })(),
                    }}
                  />

                  <Autocomplete
                    size="small"
                    sx={{ width: 280 }}
                    value={aircraft.unit}
                    onChange={(event, newValue) => {
                      handleInputChange('unit', newValue);
                    }}
                    options={Units}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unit"
                        required={!!aircraft.freight_capacity}
                        error={Boolean(validationErrors.unit)}
                        helperText={validationErrors.unit}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid xs={12} sm={6} md={4} />

              <Grid xs={4} sm={6} md={4}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Not&nbsp;In&nbsp;Service</FormLabel>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="top"
                      control={
                        <>
                          <Switch
                            disabled
                            color="primary"
                            checked={aircraft.not_in_service}
                            onChange={(event) => {
                              const newValue = event.target.checked;
                              handleInputChange('not_in_service', newValue);
                              if (!newValue) {
                                handleInputChange('not_in_service_from', null);
                              }
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="DD/MM/YYYY"
                              disabled={!aircraft.not_in_service}
                              value={
                                aircraft.not_in_service ? dayjs(aircraft.not_in_service_from) : null
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  placeholder: 'From',
                                  error: Boolean(validationErrors.not_in_service_from),
                                  helperText: validationErrors.not_in_service_from,
                                },
                              }}
                              onChange={(newValue) => {
                                handleInputChange('not_in_service_from', newValue);
                              }}
                            />
                          </LocalizationProvider>
                        </>
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
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
                router.push('/trip_management/masters/aircrafts/list');
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
              router.push('/trip_management/masters/aircrafts/list');
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
