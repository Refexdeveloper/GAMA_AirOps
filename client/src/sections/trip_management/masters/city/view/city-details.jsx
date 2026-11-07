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
     const{cityId} =useParams()
  // const theme = useTheme();


 


  const [city, setCity] = useState({
    city_name: '',
    country: '',
    zone:""
 

  });

  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/city/${cityId}`)
        .then((res) => setCity(res.data.results))
        .catch((error) => setCity({
          city_name: '',
    time_formate: '',
        }));
    };
    fetchData();
  }, [cityId]);




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
      City
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
                   onClick={() => router.push('/trip_management/masters/city/list')}
                 >
                   Back&nbsp;To&nbsp;List
                 </Button>
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
    
      fullWidth
      label="Name"
      name='city_name'
      size="small"
      value={city.city_name}

    />
  </Grid>

  <Grid xs={12} sm={6} md={4}>
    <TextField
      value={city?.country?.country_name || ''} 
    name='country'
      fullWidth
      label="Country"
      size="small"
  
    />
  </Grid>

    <Grid xs={12} sm={6} md={4}>
    <TextField
      value={city?.zone?.zone || ""}
   
      fullWidth
      label="Zone"
      size="small"
  
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
