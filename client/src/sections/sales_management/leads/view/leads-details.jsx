/* eslint-disable import/no-unresolved */
import axios from 'axios';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Link,
  Card,
  Stack,
  Button,
  Divider,
  Container,
  TextField,
  Typography,
  Breadcrumbs,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

export default function DetailsPage() {
  const { leadId } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
    aircraft: {
      aircraft_model: '',
    },
    trip: [],
    remark: '',
    creator: {
      email: '',
      create_at: null,
    },
    updater: {
      email: '',
      update_at: null,
    },
  });
  console.log(lead);
  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`/api/lead/${leadId}`).then((res) => setLead(res.data.results));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/sales_management">
      Sales&nbsp;Management
    </Link>,
    // <Link underline="hover" key="2" color="inherit" href="/app/masters">
    //   Masters
    // </Link>,
    <Typography key="2" color="text.disabled">
      Leads
    </Typography>,
    <Typography key="3" color="text.disabled">
      {`SAPL/LD-${String(leadId).padStart(4, '0')}`}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
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
          onClick={() => router.push('/sales_management/leads')}
        >
          Back&nbsp;To&nbsp;List
        </Button>
      </Stack>

      <Card>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Lead Details :
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid xs={12} sm={4} md={3} mb={2}>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  id="lead-number"
                  label="Lead Number"
                  value={`SAPL/LD-${String(lead.id).padStart(4, '0')}`}
                />
              </Grid>
              <Grid xs={false} sm={6} md={6} />
              <Grid xs={12} sm={4} md={3} mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimeField
                    disabled
                    fullWidth
                    size="small"
                    id="quote-date-created"
                    label="Date Create"
                    value={dayjs(lead.created_at)}
                    format="DD / MM / YYYY hh:mm A"
                  />
                </LocalizationProvider>
              </Grid>

              <Grid xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  id="customer_name"
                  label="Customer Number"
                  value={lead.name}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  id="customer_email"
                  label="Email"
                  value={lead.email}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  id="customer_phone"
                  label="Phone"
                  value={lead.phone}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  id="aircraft_model"
                  label="Aircraft Model"
                  value={lead.aircraft.aircraft_model}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  id="customer_remark"
                  label="Remark"
                  multiline
                  rows={2}
                  value={lead.remark}
                />
              </Grid>
            </Grid>
          </Box>
          <Box p={3}>
            <Box mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Trip Details :
              </Typography>
            </Box>
            {lead.trip.map((_t, index) => (
              <Grid key={index} container spacing={2} paddingBlockEnd={1}>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Departure Airport"
                    value={lead.trip[index].departure_airport.airport_name}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Arrival Ariport"
                    value={lead.trip[index].arrival_airport.airport_name}
                  />
                </Grid>
                <Grid xs={4} sm={4} md={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pax"
                    value={lead.trip[index].pax ? lead.trip[index].pax : 'Ferry'}
                  />
                </Grid>
                <Grid xs={8} sm={8} md={2.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimeField
                      fullWidth
                      size="small"
                      label="Departure Date & Time"
                      value={dayjs(lead.trip[index].start_at)}
                      format="DD / MM / YYYY hh:mm A"
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            ))}
          </Box>
          <Box p={3}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={4} md={3} mb={2}>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  label="Created By"
                  value={lead.creator.email}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3} mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimeField
                    disabled
                    fullWidth
                    size="small"
                    id="quote-date-created"
                    label="Created At"
                    value={dayjs(lead.created_at)}
                    format="DD / MM / YYYY hh:mm A"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={12} sm={4} md={3} mb={2}>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  id="aircraft_model"
                  label="Updated By"
                  value={lead.updater.email}
                />
              </Grid>
              <Grid xs={12} sm={4} md={3} mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimeField
                    disabled
                    fullWidth
                    size="small"
                    id="quote-date-created"
                    label="Upated At"
                    value={dayjs(lead.updated_at)}
                    format="DD / MM / YYYY hh:mm A"
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Card>
    </Container>
  );
}
