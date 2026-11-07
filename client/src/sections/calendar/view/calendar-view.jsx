import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import { Card, Stack, Button, Container, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function Calendar() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography component="div" variant="h4">
          Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          // onClick={() => router.push('/sales_management/customers/new')}
        >
          New&nbsp;event
        </Button>
      </Stack>
      <Card sx={{ overflow: 'visible', p: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: 'event 1', date: '2024-10-08' },
            { title: 'event 2', date: '2024-10-19' },
          ]}
        />
      </Card>
    </Container>
  );
}
