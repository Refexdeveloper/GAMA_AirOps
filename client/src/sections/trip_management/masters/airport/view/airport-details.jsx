import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
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

export default function NewPage() {
  const { customerId } = useParams();
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`/api/customer/${customerId}`).then((res) => setCustomer(res.data.results));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {`SAPL/LD-${String(customerId).padStart(4, '0')}`}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
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
            onClick={() => router.push('/sales_management/customers')}
          >
            Back&nbsp;To&nbsp;List
          </Button>
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
                    value={`SAPL/CU-${String(customer.id).padStart(4, '0')}`}
                  />
                </Grid>
                <Grid xs={false} sm={7} md={6} mb={5} />
                <Grid xs={12} sm={4} md={3} mb={5}>
                  <TextField fullWidth size="small" label="Type" value={customer.type} />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField required fullWidth label="Name" size="small" value={customer.name} />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField required fullWidth label="Email" size="small" value={customer.email} />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField required fullWidth label="Phone" size="small" value={customer.phone} />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  {customer.type !== 'Individual' && (
                    <TextField size="small" fullWidth label="GST No" value={customer.gst_no} />
                  )}
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={customer.address}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    label="Meal Preference"
                    multiline
                    rows={2}
                    value={customer.meal_preference}
                  />
                </Grid>
                <Grid xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={customer.description}
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
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
