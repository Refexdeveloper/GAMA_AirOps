// import { useParams } from 'react-router-dom';

// import { Box, Link, Stack, Container, Typography, Breadcrumbs } from '@mui/material';

// // import { useRouter } from 'src/routes/hooks';

// import Iconify from 'src/components/iconify';

// export default function EditPage() {
//   const { userId } = useParams();
//   // const router = useRouter();

//   const breadcrumbs = [
//     <Link underline="hover" key="1" color="inherit" href="/admin">
//       Admin
//     </Link>,
//     // <Link underline="hover" key="2" color="inherit" href="/app/masters">
//     //   Masters
//     // </Link>,
//     <Typography key="2" color="text.disabled">
//       User
//     </Typography>,
//     <Typography key="3" color="text.disabled">
//       {userId}
//     </Typography>,
//   ];

//   return (
//     <Container maxWidth="xl">
//       <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
//         <Box>
//           <Typography variant="h4" gutterBottom>
//             Edit
//           </Typography>
//           <Breadcrumbs
//             separator={<Iconify icon="eva:chevron-right-fill" />}
//             aria-label="breadcrumb"
//             sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
//           >
//             {breadcrumbs}
//           </Breadcrumbs>
//         </Box>
//         {/* <Button
//           variant="contained"
//           startIcon={<Iconify icon="eva:plus-fill" />}
//           onClick={() => router.push('/admin/user/new')}
//         >
//           New&nbsp;User
//         </Button> */}
//       </Stack>
//     </Container>
//   );
// }

import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect, forwardRef, useCallback, useRef } from 'react';

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
  FormLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  Tooltip,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import styled from 'styled-components';
import Iconify from 'src/components/iconify';
import { useParams } from 'react-router-dom';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


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
  backgroundColor: isError ? theme.palette.error.light : theme.palette?.action?.hover,
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

export default function
  EditPage() {
  const router = useRouter();
  // const theme = useTheme();
  const fileInputRef = useRef(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );


  const userType = ['SuperAdmin', 'Admin', 'User',];

  const [selectedPhoto, setSelectedPhoto] = useState(null);



  const [user, setUser] = useState({
    full_name: '',
    phone: '',
    photo: null,
    role: "",
    email: "",
    is_verified: false,
    is_active: false

  });
  const { userId } = useParams();


  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      setUser(res?.data?.results);
    } catch (error) {
      setUser({
        full_name: '',
        phone: '',
        role: '',
        email: '',
        is_verified: false,
        is_active: false,
      });
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);







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
  const keys = Object.keys(user);

    const formData = new FormData();

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = user[key];

      if (key === 'photo') {
        if (value instanceof File) {
          formData.append('photo', value);
        }
      } else {
        formData.append(key, value);
      }
    }

    try {
      await axios
        .put(`/api/users/${userId}`, formData)
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

  // const router = useRouter();

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin">
      Admin
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Typography key="2" color="text.disabled">
      User
    </Typography>,
    <Typography key="3" color="text.disabled">
      {userId}
    </Typography>,
  ];



  // File change handler
  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      handleInputChange(field, file); // Update form value (optional if you use FormData)
    }


  }

  const handleClick = () => {
    fileInputRef.current.click();
  };


  return (
    <Container maxWidth="xl">
      <Stack spacing={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" gutterBottom>
              Edit &nbsp;user
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
          <Grid item xs={12} md={4.5}>
            <Card sx={{ margin: 1, padding: 1 }}>
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
                    multiple={false}
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
                    {(selectedPhoto || user?.photo) && (
                      <Box
                        component="img"
                        alt="Crew Photo"
                        src={
                          selectedPhoto
                            ? URL.createObjectURL(selectedPhoto) // local preview
                            : user?.photo                         // existing image from API
                        }
                        sx={{
                          overflow: 'hidden',
                          position: 'relative',
                          verticalAlign: 'bottom',
                          display: 'inline-block',
                          borderRadius: '50%',
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
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
                  {(selectedPhoto || user?.photo) && (
                    <Stack
                      direction="row"
                      gap={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-evenly">
                        <Typography display="block" textAlign="center" variant="body1">
                          {selectedPhoto
                            ? selectedPhoto.name
                            : user?.photo?.split('/').pop()}
                        </Typography>
                      </Box>
                      <Tooltip title="Remove Photo" placement="bottom">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedPhoto(null);
                            handleInputChange('photo', null); // clear from form data
                          }}
                        >
                          <Iconify icon="solar:gallery-remove-bold" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}

                  <Typography display="block" textAlign="center" variant="caption">
                    Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                    Max size of 4.0 MB
                  </Typography>
                </Stack>
              </Stack>

            </Card>
          </Grid>
          <Grid item xs={12} md={7.5}>
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
                        renderInput={(value) => (
                          <TextField
                            required
                            {...value}
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
                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                        <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                      </RadioGroup>
                    </Grid>
                  </Grid>


                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>


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

