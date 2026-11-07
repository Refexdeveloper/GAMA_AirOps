/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import {
  Box,
  Link,
  Card,
  Stack,
  Button,
  Divider,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
  LinearProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

export default function DetailsPage() {
  const { modelId } = useParams();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [model, setModel] = useState(null);

  console.log(model);
  const action = useCallback(
    (snackbarId) => (
      <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
        <Iconify icon="eva:close-outline" />
      </IconButton>
    ),
    [closeSnackbar]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`/api/aircraft_models/${modelId}`).then((response) => {
          if (response.data.status) {
            setModel(response.data.results);
          } else {
            router.push('/404');
          }
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error', action });
        router.push('/404');
      }
    };
    fetchData();
  }, [modelId, action, enqueueSnackbar, router]);

  const renderImagePreviews = (images) =>
    images.map((image, index) => (
      <>
        {image && (
          <img
            key={index}
            src={image}
            alt="preview"
            // style={{ width: '100px', height: '100px', margin: '5px' }}
            style={{ margin: '5px' }}
          />
        )}
      </>
    ));

  if (!model) {
    return (
      <Stack sx={{ height: '70vh' }} alignItems="center" justifyContent="center">
        <Box width="30%">
          <LinearProgress />
        </Box>
      </Stack>
    );
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Link key="3" underline="hover" color="inherit" href="/trip_management/masters/aircraft_models">
      Aircraft&nbsp;Model
    </Link>,
    <Typography key="4" color="text.disabled">
      {model.aircraft_model}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {model.aircraft_model}
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
          color="error"
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={() => router.push('/trip_management/masters/aircraft_models')}
        >
          Back&nbsp;To&nbsp;List
        </Button>
      </Stack>
      <Card sx={{ p: 3 }}>
        <Stack
          pb={3}
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        >
          <Box width={1}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Aircraft Model Details :
              </Typography>
            </Box>
            <Typography component="span" variant="subtitle1">
              Model :&nbsp;
            </Typography>
            {model.aircraft_model}
            <br />
            <Typography component="span" variant="subtitle1">
              Manufacture :&nbsp;
            </Typography>
            {model.aircraft_manufacture}
            <br />
            <Typography component="span" variant="subtitle1">
              Type :&nbsp;
            </Typography>
            {model.aircraft_type}
            <br />
            <Typography component="span" variant="subtitle1">
              Wing Type :&nbsp;
            </Typography>
            {model.wing_type}
            <br />
            <Typography component="span" variant="subtitle1">
              Period of Manufacture :&nbsp;
            </Typography>
            {model.period_of_manufacture}
            <br />
            <Typography component="span" variant="subtitle1">
              Per hour cost :&nbsp;
            </Typography>
            {model.aircraft_per_hour_cost.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            <br />
            <Typography component="span" variant="subtitle1">
              Base Location :&nbsp;
            </Typography>
            {model.base_airport &&
              `${model.base_airport.airport_name} (${model.base_airport.icao_code})`}
            <br />
            <Typography component="span" variant="subtitle1">
              Attendant Availability :&nbsp;
            </Typography>
            {model.aircraft_attendant_availability ? 'Yes' : 'No'}
            <br />
            <Typography component="span" variant="subtitle1">
              WiFi Availability :&nbsp;
            </Typography>
            {model.wifi_availability ? 'Yes' : 'No'}
            <br />
            <Typography component="span" variant="subtitle1">
              Satellite Phone Availability :&nbsp;
            </Typography>
            {model.satellite_phone ? 'Yes' : 'No'}
            <br />
            <Typography component="span" variant="subtitle1">
              Lavatory Availability :&nbsp;
            </Typography>
            {model.lavatory ? 'Yes' : 'No'}
            <br />
          </Box>
          <Box width={1}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Specification Details :
              </Typography>
            </Box>
            <Stack direction="row">
              <Box width={1}>
                <Typography component="span" variant="subtitle1">
                  No. of Pilots :&nbsp;
                </Typography>
                {model.pilots}
                <br />
                <Typography component="span" variant="subtitle1">
                  No. of Seats :&nbsp;
                </Typography>
                {model.seats}
                <br />
                <Typography component="span" variant="subtitle1">
                  No. of Engines :&nbsp;
                </Typography>
                {model.engine}
                <br />
                <Typography component="span" variant="subtitle1">
                  Engine Model :&nbsp;
                </Typography>
                {model.engine_model}
                <br />
                <Typography component="span" variant="subtitle1">
                  Runway Length :&nbsp;
                </Typography>
                {model.runway_length} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Fuel Capacity :&nbsp;
                </Typography>
                {model.fuel_capacity} lbs
                <br />
                <Typography component="span" variant="subtitle1">
                  Empty Weight :&nbsp;
                </Typography>
                {model.empty_weight} lbs
                <br />
                <Typography component="span" variant="subtitle1">
                  Baggages Capacity :&nbsp;
                </Typography>
                {model.baggages_capacity} lbs
                <br />
                <Typography component="span" variant="subtitle1">
                  Max Payload :&nbsp;
                </Typography>
                {model.max_payload} lbs
                <br />
                <Typography component="span" variant="subtitle1">
                  Max take of weight :&nbsp;
                </Typography>
                {model.max_take_of_weight} lbs
                <br />
                <Typography component="span" variant="subtitle1">
                  Aircraft Wingspan :&nbsp;
                </Typography>
                {model.wingspan} ft
                <br />
              </Box>
              <Box width={1}>
                <Typography component="span" variant="subtitle1">
                  Aircraft Length :&nbsp;
                </Typography>
                {model.length} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Aircraft Height :&nbsp;
                </Typography>
                {model.height} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Cabin Length :&nbsp;
                </Typography>
                {model.cabin_length} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Cabin Height :&nbsp;
                </Typography>
                {model.cabin_height} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Cabin Width :&nbsp;
                </Typography>
                {model.cabin_width} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Max Ceiling :&nbsp;
                </Typography>
                {model.max_ceiling} ft
                <br />
                <Typography component="span" variant="subtitle1">
                  Aircraft Range :&nbsp;
                </Typography>
                {model.range} nm
                <br />
                <Typography component="span" variant="subtitle1">
                  Max Cruising Speed :&nbsp;
                </Typography>
                {model.max_cruising_speed} kn
                <br />
              </Box>
            </Stack>
          </Box>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box pt={3}>
          <Box mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Aircraft Model Images :
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Aircraft :</Typography>
              <Box mt={1}>{renderImagePreviews(model.aircraft)}</Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Interior :</Typography>
              <Box mt={1}>{renderImagePreviews(model.interior)}</Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Lopa :</Typography>
              <Box mt={1}>{renderImagePreviews(model.lopa)}</Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Cabin :</Typography>
              <Box mt={1}>{renderImagePreviews(model.cabin)}</Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}
