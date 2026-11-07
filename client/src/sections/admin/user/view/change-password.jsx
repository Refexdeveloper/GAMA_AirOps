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

import Iconify from 'src/components/iconify';

import { useAuth } from 'src/context/AuthContext';
import PropTypes from 'prop-types';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);



export default function 
PasswordEditPage({setOpenPasswordDialog, is_admin,userId}) {
    const { user } = useAuth();
  // const theme = useTheme();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId) => (
    <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
      <Iconify icon="eva:close-outline" />
    </IconButton>
  );




  const [userDetail, setUser] = useState({
    old_password: '',
    change_password: '',
    new_password:"",



  });
  


  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  











  const handleInputChange = (field, value) => {
    setUser((pre) => ({ ...pre, ...{ [field]: value } }));
    setValidationErrors({});
    // setChangeMade(true);
  };
const validateData = () => {
  const errors = {};
  if(!is_admin){
  if (!userDetail.old_password ) errors.old_password = 'Old Password is required';
      
  }
  if (!userDetail.new_password) errors.new_password = 'New Password is required';
   if (userDetail.new_password.length < 6) {
  errors.new_password = 'New password must be at least 6 characters long';
}
  if (!userDetail.confirm_password) {
    errors.confirm_password = 'Confirm Password is required';
  } else if (userDetail.new_password !== userDetail.confirm_password) {
    errors.confirm_password = 'Password does not Match';
  }

  return errors;
};
  const handleSubmit = async (event) => {
    setLoading(true);
    const errors = validateData();
    if (Object.keys(errors).length > 0) {
       console.log("errors",errors)
      setValidationErrors(errors);
      setLoading(false);
      return;
    }



    try {
      await axios
        .post(`/api/change_password`,{
            new_password:userDetail.new_password,
             ...(is_admin ?{
              target_user_id:userId
             } :{
              old_password:userDetail.old_password
             })

        })
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            setLoading(false);
            setOpenPasswordDialog(false)
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



// File change handler





  return (
    <Container maxWidth="xl">
      <Stack spacing={5}>
      
           <Grid container spacing={2}>
          
        <Grid item xs={12} md={12}>
            {/* <Card sx={{ overflow: 'visible' }}> */}
          <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            <Box px={2} pt={2} pb={5}>
            
              <Grid container spacing={4}>
              
    {
       !is_admin &&
         <Grid xs={12} sm={6} md={12}>
    <TextField
      required
      fullWidth
      label="Old Password"
      size="small"
      value={userDetail.old_password}
      error={Boolean(validationErrors.old_password)}
      helperText={validationErrors.old_password}
      onChange={(event) => handleInputChange('old_password', event.target.value)}
    />
  </Grid>
    }

  <Grid xs={12} sm={6} md={12}>
    <TextField
      required
      fullWidth
      label="New Password"
      size="small"
      value={userDetail.new_password}
      error={Boolean(validationErrors.new_password)}
      helperText={validationErrors.new_password}
      onChange={(event) => {
        const { value } = event.target;
       
          handleInputChange('new_password', value);
        
      }}
    />
  </Grid>
  <Grid xs={12} sm={6} md={12}
 >
  <TextField
    required
    fullWidth
    label="Confirm Password"
    size="small"
    value={userDetail.confirm_password}
    error={Boolean(validationErrors.confirm_password)}
    helperText={validationErrors.confirm_password}
    onChange={(event) => handleInputChange('confirm_password', event.target.value)}
  />
</Grid>

</Grid>

           
            </Box>
          </Stack>
        {/* </Card> */}
        </Grid>
           </Grid>
           
      
      </Stack>
      <Grid container justifyContent="flex-end" spacing={3} pt={3}>
        <Grid xs={12} sm={6} md={3}>
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
        <Grid xs={12} sm={6} md={3}>
          <Button
            onClick={() => {
              setOpenPasswordDialog(false)
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
             setOpenPasswordDialog(false)
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

PasswordEditPage.propTypes={
  setOpenPasswordDialog:PropTypes.any,
  userId:PropTypes.string,
  is_admin:PropTypes.bool


}


