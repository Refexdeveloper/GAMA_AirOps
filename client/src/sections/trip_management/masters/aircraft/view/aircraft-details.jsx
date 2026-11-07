import { useParams } from 'react-router-dom';

import { Box, Link, Stack, Container, Typography, Breadcrumbs } from '@mui/material';

// import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

export default function DetailsPage() {
  const { aircraftId } = useParams();
  // const router = useRouter();

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Link key="3" underline="hover" color="inherit" href="/trip_management/masters/aircrafts">
      Aircraft
    </Link>,
    <Typography key="4" color="text.disabled">
      {aircraftId}
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
        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push('/admin/user/new')}
        >
          New&nbsp;User
        </Button> */}
      </Stack>
    </Container>
  );
}
