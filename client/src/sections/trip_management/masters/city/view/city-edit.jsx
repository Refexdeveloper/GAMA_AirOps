import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef } from 'react';

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
import { useParams } from 'react-router-dom';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function NewPage() {
  const router = useRouter();
  const {cityId}=useParams()
  // const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );


  const [city, setCity] = useState({
    city_name: '',
    country_id: '',
    zone_id:""
 

  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [country, setCountry] =useState([])
  const [zones, setZones] =useState([])

  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

   useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [cityData ,countryRes, zoneRes] = await Promise.all([
        axios.get(  `/api/city/${cityId}`),
        axios.get('/api/get_all_country'),
        axios.get('/api/all_zones'),
      ]);
      setCity(cityData?.data?.results)
      setCountry(countryRes.data);
      setZones(zoneRes.data);
    } catch (error) {
      setCountry([]);
      setZones([]);
    }
  };

  fetchInitialData();
}, [cityId]);

  const handleInputChange = (field, value) => {
    setCity((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };
const validateData = () => {
  const errors = {};

  if (!city.city_name) errors.name = 'Name is required';
  if (!city.country_id) errors.country_id = 'Country is required';
  if (!city.zone_id) errors.zone_id = 'Zone is required';

  

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
        .put(`/api/city/${cityId}`, {
           ...city,

        })
        .then((response) => {
          if (response.data.status) {
            setLoading(false);
            router.push('/trip_management/masters/city/list');
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
     Admin
      {/* Sales&nbsp;Management */}
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Link key="2" underline="hover" color="inherit" href="/sales_management/citys">
      City
    </Link>,
    <Typography key="3" color="text.disabled">
      Edit&nbsp;City
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Edit&nbsp;a&nbsp;City
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
            <Box px={3} pt={3} pb={10}>
              <Box mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  City Details :
                </Typography>
              </Box>
              <Grid container spacing={4}>
  <Grid xs={12} sm={6} md={4}>
    <TextField
      required
      fullWidth
      label="Name"
      size="small"
      value={city.city_name}
      error={Boolean(validationErrors.city_name)}
      helperText={validationErrors.city_name}
      onChange={(event) => handleInputChange('city_name', event.target.value)}
    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
  <Autocomplete
    disableClearable
    size="small"
    options={country}
    getOptionLabel={(option) => option.name || ''}
    value={country.find((c) => c.id === city.country_id) || null}
    onChange={(event, value) => handleInputChange('country_id', value?.id || '')}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Country"
        required
        error={Boolean(validationErrors.country_id)}
        helperText={validationErrors.country_id}
      />
    )}
  />
</Grid>

<Grid xs={12} sm={6} md={4}>
  <Autocomplete
    disableClearable
    size="small"
    options={zones}
    getOptionLabel={(option) => option.name || ''}
    value={zones.find((z) => z.id === city.zone_id) || null}
    onChange={(event, value) => handleInputChange('zone_id', value?.id || '')}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Zone"
        required
        error={Boolean(validationErrors.zone_id)}
        helperText={validationErrors.zone_id}
      />
    )}
  />
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
            Save
          </LoadingButton>
        </Grid>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={() => {
              if (changeMade) {
                handleClickAlert();
              } else {
                router.push('/trip_management/masters/city/list');
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
              router.push('/trip_management/masters/city/list');
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
