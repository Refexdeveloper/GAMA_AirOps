import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
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

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function EditPage() {
  const { customerId } = useParams();
  const router = useRouter();
  // const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );

  const customerType = ['Individual', 'Company', 'Proprietorship', 'Partnership'];
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gst_no: '',
    description: '',
    meal_preference: '',
    type: 'Individual',
    company_name: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`/api/customer/${customerId}`).then((response) => {
          setCustomer(response.data.results);
          console.log(response);
        });
      } catch (error) {
        setCustomer({});
      }
    };
    fetchData();
  }, [customerId]);

  const handleInputChange = (field, value) => {
    setCustomer((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };

  const validateData = () => {
    const errors = {};

    if (!customer.name) errors.name = 'Customer Name is required';
    if (!customer.phone) errors.phone = 'Phone is required';
    if (!customer.address) errors.address = 'Address is required';
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
      errors.email = 'Please enter a valid email';

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
        .put(`/api/customer/${customerId}`, customer)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/sales_management/customers/list');
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
    <Link key="2" underline="hover" color="inherit" href="/sales_management/customers">
      Customers
    </Link>,
    <Typography key="3" color="text.disabled">
      {`SAPL/CU-${String(customerId).padStart(4, '0')}`}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        </Stack>
        <Card sx={{ overflow: 'visible' }}>
          <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            <Box px={3} pt={3} pb={10}>
              <Box mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Customer Details :
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={4} md={3} mb={5}>
                  <TextField
                    disabled
                    fullWidth
                    size="small"
                    label="Customer No"
                    value={`SAPL/CU-${String(customerId).padStart(4, '0')}`}
                  />
                </Grid>
                {/* <Grid xs={12} sm={4} md={3} mb={2}>
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
                </Grid> */}
                <Grid xs={false} sm={7} md={6} mb={5} />
                <Grid xs={12} sm={4} md={3} mb={5}>
                  <Autocomplete
                    disableClearable
                    size="small"
                    value={customerType.find((_ct) => _ct === customer.type) || null}
                    onChange={(event, value) => handleInputChange('type', value)}
                    options={customerType}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Type"
                        error={Boolean(validationErrors.type)}
                        helperText={validationErrors.type}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    size="small"
                    value={customer.name}
                    error={Boolean(validationErrors.name)}
                    helperText={validationErrors.name}
                    onChange={(event, value) => handleInputChange('name', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Phone"
                    size="small"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={customer.phone}
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
                  <TextField
                    fullWidth
                    label="Email"
                    size="small"
                    value={customer.email}
                    error={Boolean(validationErrors.email)}
                    helperText={validationErrors.email}
                    onChange={(event, value) => handleInputChange('email', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  {customer.type !== 'Individual' && (
                    <TextField
                      size="small"
                      fullWidth
                      label="GST No"
                      value={customer.gst_no}
                      error={Boolean(validationErrors.gst_no)}
                      helperText={validationErrors.gst_no}
                      onChange={(event, value) => handleInputChange('gst_no', event.target.value)}
                    />
                  )}
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={customer.address}
                    error={Boolean(validationErrors.address)}
                    helperText={validationErrors.address}
                    onChange={(event, value) => handleInputChange('address', event.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    label="Meal Preference"
                    multiline
                    rows={2}
                    value={customer.meal_preference}
                    error={Boolean(validationErrors.meal_preference)}
                    helperText={validationErrors.meal_preference}
                    onChange={(event, value) =>
                      handleInputChange('meal_preference', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={customer.description}
                    error={Boolean(validationErrors.description)}
                    helperText={validationErrors.description}
                    onChange={(event, value) =>
                      handleInputChange('description', event.target.value)
                    }
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  {customer.type !== 'Individual' && (
                    <TextField
                      fullWidth
                      label="Company Name"
                      multiline
                      rows={2}
                      value={customer.company_name}
                      error={Boolean(validationErrors.company_name)}
                      helperText={validationErrors.company_name}
                      onChange={(event, value) =>
                        handleInputChange('company_name', event.target.value)
                      }
                    />
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
            Save
          </LoadingButton>
        </Grid>
        <Grid xs={12} sm={6} md={1.5}>
          <Button
            onClick={() => {
              if (changeMade) {
                handleClickAlert();
              } else {
                router.push('/sales_management/customers/list');
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
              router.push('/sales_management/customers/list');
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
