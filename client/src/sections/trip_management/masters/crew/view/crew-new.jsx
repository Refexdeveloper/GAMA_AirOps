import axios from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useRef, useState, useEffect, forwardRef } from 'react';

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
  Radio,
  Button,
  Dialog,
  Switch,
  styled,
  Divider,
  Tooltip,
  Checkbox,
  Container,
  TextField,
  FormLabel,
  FormGroup,
  Typography,
  IconButton,
  RadioGroup,
  Breadcrumbs,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

const PhotoBox = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '50%',
  border: '1px dashed rgba(145, 158, 171, 0.2)',
  '&:hover': {
    '.upload-placeholder': {
      opacity: 1,
      // backgroundColor:theme.palette.action.hover,
    },
  },
}));

const PhotoStack = styled(Stack)(({ theme, isError, selectedPhoto }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 9,
  borderRadius: '50%',
  position: 'absolute',
  transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  opacity: selectedPhoto ? 0 : 0.8,
  backgroundColor: isError ? theme.palette.error.light : theme.palette.action.hover,
}));

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

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const OnDutyAs = ['Pilot In Command'];
const CountriesCode = ['+91'];

export default function NewPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [operators, setOperators] = useState([]);
  const [models, setModels] = useState([]);
  const [criticalAirports, setCriticalAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [crew, setCrew] = useState({
    operator_id: 1,
    name: '',
    code: '',
    photo: null,
    nationality: '',
    city: '',
    designation: '',
    on_duty_as: '',
    country_code: '',
    mobile_no: null,
    email: '',
    dob: null,
    passport: '',
    doj: null,
    not_in_service: false,
    not_in_service_from: null,
    gender: 'Male',
    last_flight_on: null,
    arrival_at: null,
    applicable_models: [],
    applicable_critical_airports: [],
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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
    // const fetchAirports = async () => {
    //   try {
    //     await axios.get('/api/airports').then((response) => {
    //       // console.log(response.data);
    //       const aps = response.data;
    //       setAirports(response.data);
    //     });
    //   } catch (error) {
    //     setAirports([]);
    //   }
    // };
    fetchOperators();
    fetchModels();
  }, []);

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const handleInputChange = (field, value) => {
    setCrew((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    const limits = {
      photo: 1,
    };

    if (files.length > limits[field]) {
      enqueueSnackbar(`You can only upload up to ${limits[field]} ${field} image.`, {
        variant: 'error',
        action,
      });
      handleInputChange(field, []);
      setSelectedPhoto(false);
    } else {
      setSelectedPhoto(true);
      handleInputChange(field, files);
    }
    e.target.value = null;
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const validateData = () => {
    const errors = {};

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
        .post('/api/crew', crew)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/trip_management/masters/crew/list');
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
    <Link key="3" underline="hover" color="inherit" href="/trip_management/masters/crew">
      Crew
    </Link>,
    <Typography key="4" color="text.disabled">
      New&nbsp;Crew
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Create&nbsp;a&nbsp;new&nbsp;crew
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
          <Card>
            <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
              <Box p={3}>
                <Box mb={2}>
                  <Typography variant="h5" textAlign="center" sx={{ fontWeight: 700 }}>
                    {crew.name}
                  </Typography>
                </Box>

                <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} spacing={2}>
                  <Stack alignItems="center" justifyContent="center" spacing={1}>
                    <PhotoBox
                      onClick={handleClick}
                      role="presentation"
                      tabIndex={0}
                      component="div"
                    >
                      <HiddenInput
                        type="file"
                        ref={fileInputRef}
                        tabIndex={-1}
                        accept=".png,.jpg,.jpeg,.gif"
                        multiple
                        onChange={(e) => handleFileChange(e, 'photo')}
                      />
                      <Box
                        sx={{
                          top: 10,
                          left: 10,
                          width: '90%',
                          height: '90%',
                          overflow: 'hidden',
                          borderRadius: '50%',
                          position: 'relative',
                        }}
                      >
                        {selectedPhoto && (
                          <Box
                            component="img"
                            alt="Crew Photo"
                            src={URL.createObjectURL(crew.photo[0])}
                            sx={{
                              overflow: 'hidden',
                              position: 'relative',
                              verticalAlign: 'bottom',
                              display: 'inline-block',
                              borderRadius: '50%',
                              height: '100%',
                              width: '100%',
                            }}
                          />
                        )}
                        <PhotoStack
                          gap={1}
                          className="upload-placeholder"
                          selectedPhoto={selectedPhoto}
                          isError={Boolean(validationErrors.photo)}
                        >
                          <Iconify icon="solar:camera-add-bold" width={42} />
                          <Typography display="block" textAlign="center" variant="caption">
                            Update photo
                          </Typography>
                        </PhotoStack>
                      </Box>
                    </PhotoBox>
                    <Stack>
                      {selectedPhoto && (
                        <Stack
                          direction="row"
                          gap={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {/* <Tooltip title="Preview Photo" placement="bottom">
                            <IconButton
                              aria-label="preview-photo"
                              size="small"
                              color="primary"
                              onClick={handleClickOpenPreview}
                            >
                              <Iconify icon="solar:gallery-circle-bold" />
                            </IconButton>
                          </Tooltip> */}
                          <Box display="flex" alignItems="center" justifyContent="space-evenly">
                            <Typography display="block" textAlign="center" variant="body1">
                              {crew.photo[0].name}
                            </Typography>
                          </Box>
                          <Tooltip title="Remove Photo" placement="bottom">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedPhoto(null);
                                handleInputChange('photo', null);
                              }}
                            >
                              <Iconify icon="solar:gallery-remove-bold" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                      <Typography display="block" textAlign="center" variant="caption">
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br />
                        max size of 4.0 MB
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" textAlign="center">
                      Roster Status
                    </Typography>
                    <Typography variant="body2">Last Flight On</Typography>
                    <Typography variant="body2">Arrival At</Typography>
                    <Typography variant="body2">Location/City</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8.5}>
          <Card>
            <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
              <Box p={3}>
                <Box mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Crew Details :
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid xs={4} sm={6} md={6}>
                    <Autocomplete
                      disabled
                      value={operators.find((_op) => _op.id === crew.operator_id) || null}
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
                      label="Name"
                      value={crew.name}
                      onChange={(event) => {
                        handleInputChange('name', event.target.value);
                      }}
                      error={Boolean(validationErrors.name)}
                      helperText={validationErrors.name}
                    />
                  </Grid>
                  <Grid xs={4} sm={6} md={6}>
                    <TextField
                      size="small"
                      fullWidth
                      required
                      label="Code"
                      value={crew.code}
                      onChange={(event) => {
                        handleInputChange('code', event.target.value);
                      }}
                      error={Boolean(validationErrors.code)}
                      helperText={validationErrors.code}
                    />
                  </Grid>
                  <Grid xs={4} sm={6} md={6}>
                    <Autocomplete
                      fullWidth
                      autoComplete="off"
                      size="small"
                      getOptionLabel={(option) => option.name}
                      value={countries.find((_con) => _con.name === crew.nationality) || null}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleInputChange('nationality', newValue.name);
                        } else {
                          handleInputChange('nationality', null);
                        }
                      }}
                      options={countries}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Nationality"
                          error={Boolean(validationErrors.nationality)}
                          helperText={validationErrors.nationality}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={4} sm={6} md={6}>
                    <Stack direction="row" spacing={2}>
                      <Autocomplete
                        autoComplete="off"
                        fullWidth
                        size="small"
                        getOptionLabel={(option) => option.city_name}
                        value={cities.find((_cty) => _cty.city_name === crew.city) || null}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleInputChange('city', newValue.city_name);
                          } else {
                            handleInputChange('city', null);
                          }
                        }}
                        options={cities}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="City"
                            error={Boolean(validationErrors.city)}
                            helperText={validationErrors.city}
                          />
                        )}
                      />
                      {/* <Tooltip title="New City">
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push('/trip_management/masters/city/list');
                            handleClickAlert();
                          }}
                        >
                          <Iconify icon="material-symbols:add-rounded" />
                        </Button>
                      </Tooltip> */}
                    </Stack>
                  </Grid>
                  <Grid xs={4} sm={6} md={6}>
                    <Stack direction="row" spacing={2}>
                      <Autocomplete
                        fullWidth
                        autoComplete="off"
                        size="small"
                        getOptionLabel={(option) => option.designation}
                        value={
                          designation.find((_des) => _des.designation === crew.designation) || null
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleInputChange('designation', newValue.designation);
                          } else {
                            handleInputChange('designation', null);
                          }
                        }}
                        options={designation}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Designation"
                            error={Boolean(validationErrors.designation)}
                            helperText={validationErrors.designation}
                          />
                        )}
                      />
                      {/* <Tooltip title="New Designation">
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push('/trip_management/masters/designation/list');
                            handleClickAlert();
                          }}
                        >
                          <Iconify icon="material-symbols:add-rounded" />
                        </Button>
                      </Tooltip> */}
                    </Stack>
                  </Grid>

                  <Grid xs={4} sm={6} md={6}>
                    <Stack direction="row" spacing={2}>
                      <Autocomplete
                        autoComplete={false}
                        fullWidth
                        size="small"
                        // getOptionLabel={(option) => option.designation}
                        value={crew.on_duty_as}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleInputChange('on_duty_as', newValue);
                          } else {
                            handleInputChange('on_duty_as', null);
                          }
                        }}
                        options={OnDutyAs}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="On Duty As"
                            error={Boolean(validationErrors.on_duty_as)}
                            helperText={validationErrors.on_duty_as}
                          />
                        )}
                      />
                      {/* <Tooltip title="New Designation">
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push('/trip_management/masters/designation/list');
                            handleClickAlert();
                          }}
                        >
                          <Iconify icon="material-symbols:add-rounded" />
                        </Button>
                      </Tooltip> */}
                    </Stack>
                  </Grid>

                  <Grid xs={4} sm={6} md={2.5}>
                    <Autocomplete
                      fullWidth
                      size="small"
                      value={crew.country_code}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          handleInputChange('country_code', newValue);
                        } else {
                          handleInputChange('country_code', null);
                        }
                      }}
                      options={CountriesCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Country Code"
                          error={Boolean(validationErrors.country_code)}
                          helperText={validationErrors.country_code}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={4} sm={6} md={3.5}>
                    <TextField
                      required
                      fullWidth
                      label="Mobile No."
                      size="small"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      value={crew.mobile_no}
                      error={Boolean(validationErrors.mobile_no)}
                      helperText={validationErrors.mobile_no}
                      onChange={(event) => {
                        const { value } = event.target;
                        if (/^\d{0,10}$/.test(value)) {
                          handleInputChange('mobile_no', value);
                        }
                      }}
                    />
                  </Grid>

                  <Grid xs={4} sm={6} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      size="small"
                      value={crew.email}
                      error={Boolean(validationErrors.email)}
                      helperText={validationErrors.email}
                      onChange={(event, value) => handleInputChange('email', event.target.value)}
                    />
                  </Grid>

                  <Grid xs={4} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Passport"
                      size="small"
                      value={crew.passport}
                      error={Boolean(validationErrors.passport)}
                      helperText={validationErrors.passport}
                      onChange={(event, value) => handleInputChange('passport', event.target.value)}
                    />
                  </Grid>

                  <Grid xs={4} sm={6} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={crew.dob ? dayjs(crew.dob) : null}
                        slotProps={{
                          textField: {
                            label: 'Date Of Birth',
                            fullWidth: true,
                            size: 'small',
                            placeholder: 'DOB',
                            error: Boolean(validationErrors.dob),
                            helperText: validationErrors.dob,
                          },
                        }}
                        onChange={(newValue) => {
                          handleInputChange('dob', newValue);
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid xs={4} sm={6} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={crew.doj ? dayjs(crew.doj) : null}
                        slotProps={{
                          textField: {
                            label: 'Date Of Joining',
                            fullWidth: true,
                            size: 'small',
                            placeholder: 'DOJ',
                            error: Boolean(validationErrors.doj),
                            helperText: validationErrors.doj,
                          },
                        }}
                        onChange={(newValue) => {
                          handleInputChange('doj', newValue);
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid xs={4} sm={6} md={3}>
                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="crew_gender"
                        name="crew_gender"
                        value={crew.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

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
                                checked={crew.not_in_service}
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
                                  disabled={!crew.not_in_service}
                                  value={
                                    crew.not_in_service ? dayjs(crew.not_in_service_from) : null
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

              <Box p={3}>
                <Box mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Applicable Aircraft Models :
                  </Typography>
                </Box>

                <Autocomplete
                  multiple
                  options={models}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option.aircraft_model} (${option.wing_type})`}
                  renderOption={(props, option, { selected }) => {
                    // eslint-disable-next-line react/prop-types
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={<Iconify icon="solar:add-square-line-duotone" />}
                          checkedIcon={<Iconify icon="solar:check-square-bold-duotone" />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.aircraft_model} ({option.wing_type})
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Aircraft Models" placeholder="Add Model" />
                  )}
                />
              </Box>

              <Box p={3}>
                <Box mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Applicable Critical Airport :
                  </Typography>
                </Box>

                <Autocomplete
                  multiple
                  options={criticalAirports}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option.aircraft_model} (${option.wing_type})`}
                  renderOption={(props, option, { selected }) => {
                    // eslint-disable-next-line react/prop-types
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={<Iconify icon="solar:add-square-line-duotone" />}
                          checkedIcon={<Iconify icon="solar:check-square-bold-duotone" />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.aircraft_model} ({option.wing_type})
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Critical Airports" placeholder="Add Airport" />
                  )}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

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
                router.push('/trip_management/masters/crew/list');
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
              router.push('/trip_management/masters/crew/list');
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
