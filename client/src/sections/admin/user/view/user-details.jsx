import axios from 'axios';
import { useState, useEffect, forwardRef } from 'react';
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
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import { useParams } from 'react-router-dom';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function NewPage() {
  const router = useRouter();
   const{userId} =useParams()

  // const theme = useTheme();



  const userType = ['SuperAdmin', 'Admin', 'User', 'Partnership'];
 


  const [user, setUser] = useState({
    full_name: '',
    phone: '',
    role:"",
    email:"",
    is_verified:false,
    is_active:false



  });
  

  const [openAlert, setOpenAlert] = useState(false);
   

  useEffect(() => {
     const fetchData = async () => {
      await axios
        .get(`/api/users/${userId}`)
        .then((res) => setUser(res.data.results))
        .catch((error) => setUser({
              full_name: '',
    phone: '',
    role:"",
    email:"",
    is_verified:false,
    is_active:false
        }));
    };
  
    fetchData();

  },[userId]);

  




 

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
        View
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={5}>
         <Stack direction="row" alignItems="center" justifyContent="space-between">
                 <Box>
                   <Typography variant="h4" gutterBottom>
                     View
                   </Typography>
                   <Breadcrumbs
                     separator={<Iconify icon="eva:chevron-right-fill" />}
                     aria-label="breadcrumb"
                     sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
                   >
                     {breadcrumbs}
                   </Breadcrumbs>
                 </Box>
                 <Button
                   variant="contained"
                   startIcon={<Iconify icon="eva:arrow-back-fill" />}
                   color="error"
                   onClick={() => router.push('/admin')}
                 >
                   Back&nbsp;To&nbsp;List
                 </Button>
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

  />
</Grid>

  <Grid xs={12} sm={6} md={4}>
    <Autocomplete
      disableClearable
      size="small"
      value={user.role}

      options={userType}
      renderInput={(values) => (
        <TextField
          required
          {...values}
          label="Role"
    
        />
      )}
    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
    <Autocomplete
      disableClearable
      size="small"
      value={user.verified ? 'Yes' : 'No'}
   
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
      {/* <Grid container justifyContent="flex-end" spacing={3} pt={3}>
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
                router.push('/sales_management/users/list');
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
      </Grid> */}
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
