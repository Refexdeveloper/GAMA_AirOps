import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, forwardRef } from 'react';

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
    Radio,
  FormLabel,
  RadioGroup,
  IconButton,
  Breadcrumbs,
    DialogTitle,
  Autocomplete,

  DialogContent,
    DialogActions,


  DialogContentText,
  FormControlLabel,



  


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


  const userType = ['SuperAdmin', 'Admin', 'User', 'Partnership'];



  const [user, setUser] = useState({
    full_name: '',
    phone: '',
    role:"",
    email:"",
    is_verified:false,
    is_active:false

  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

 

  const handleInputChange = (field, value) => {
    setUser((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    setChangeMade(true);
  };
const validateData = () => {
  const errors = {};

  if (!user.full_name) errors.name = 'Name is required';
  if (!user.phone) errors.phone = 'Phone is required';
  if (!user.role) errors.role = 'Role is required';
  if (!user.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.email = 'Invalid email format';
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
        .post('/api/users', {
           ...user,
           first_name:user.full_name,
           last_name:user.lastName,
           password:"1234567890"

        })
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            router.push('/admin');
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
    <Link key="2" underline="hover" color="inherit" href="/sales_management/users">
      User
    </Link>,
    <Typography key="3" color="text.disabled">
      New&nbsp;User
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Create&nbsp;a&nbsp;new&nbsp;user
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
                  User Details :
                </Typography>
              </Box>
              <Grid container spacing={4}>
  <Grid xs={12} sm={6} md={4}>
    <TextField
      required
      fullWidth
      label="Name"
      size="small"
      value={user.full_name}
      error={Boolean(validationErrors.full_name)}
      helperText={validationErrors.full_name}
      onChange={(event) => handleInputChange('full_name', event.target.value)}
    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
    <TextField
      required
      fullWidth
      label="Phone"
      size="small"
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      value={user.phone}
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
  <Grid xs={12} sm={6} md={4}
 >
  <TextField
    required
    fullWidth
    label="Email"
    size="small"
    value={user.email}
    error={Boolean(validationErrors.email)}
    helperText={validationErrors.email}
    onChange={(event) => handleInputChange('email', event.target.value)}
  />
</Grid>

  <Grid xs={12} sm={6} md={4}>
    <Autocomplete
      disableClearable
      size="small"
      value={user.role}
      onChange={(event, value) => handleInputChange('role', value)}
      options={userType}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          label="Role"
          error={Boolean(validationErrors.role)}
          helperText={validationErrors.role}
        />
      )}
    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
    <Autocomplete
      disableClearable
      size="small"
      value={user.is_verified ? 'Yes' : 'No'}
      onChange={(event, value) =>
        handleInputChange('is_verified', value === 'Yes')
      }
      options={['Yes', 'No']}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          label="Verified"
        />
      )}
    />
  </Grid>

  <Grid xs={12} sm={6} md={12}>
  <FormLabel component="legend" sx={{ mb: 1 }}>
    Active Status
  </FormLabel>
  <RadioGroup
    row
    value={user.is_active ? 'Active' : 'Inactive'}
    onChange={(e) => handleInputChange('is_active', e.target.value === 'Active')}
  >
    <FormControlLabel value="Active" control={<Radio/>} label="Active" />
    <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
  </RadioGroup>
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
                router.push('/admin');
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
              router.push('/sales_management/users/list');
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
