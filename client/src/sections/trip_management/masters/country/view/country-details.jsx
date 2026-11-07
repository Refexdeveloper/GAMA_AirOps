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
     const{countryId} =useParams()
  // const theme = useTheme();





  const [country, setCountry] = useState({
    country_name: '',
    time_formate: '',
 

  });

  const [validationErrors, setValidationErrors] = useState({});

  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/country/${countryId}`)
        .then((res) => setCountry(res.data.results))
        .catch((error) => setCountry({
          country_name: '',
    time_formate: '',
        }));
    };
    fetchData();
  }, [countryId]);

  const handleInputChange = (field, value) => {
    setCountry((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    // setChangeMade(true);
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
      Country
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
                   onClick={() => router.push('/trip_management/masters/country/list')}
                 >
                   Back&nbsp;To&nbsp;List
                 </Button>
               </Stack>
        <Card sx={{ overflow: 'visible' }}>
          <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            <Box px={3} pt={3} pb={10}>
              <Box mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Country Details :
                </Typography>
              </Box>
              <Grid container spacing={4}>
  <Grid xs={12} sm={6} md={4}>
    <TextField
      required
      fullWidth
      label="Name"
      size="small"
      value={country.country_name}
      error={Boolean(validationErrors.country_name)}
      helperText={validationErrors.country_name}
      onChange={(event) => handleInputChange('country_name', event.target.value)}
    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
    <TextField
      required
      fullWidth
      label="Time Formate"
      size="small"
      value={country.time_formate}
      error={Boolean(validationErrors.time_formate)}
      helperText={validationErrors.time_formate}
      onChange={(event) => {
        const { value } = event.target;
    
          handleInputChange('time_formate', value);
        
      }}
    />
  </Grid>


 



</Grid>

           
            </Box>
          </Stack>
        </Card>
      </Stack>
  
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
              router.push('/trip_management/masters/country/list');
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
