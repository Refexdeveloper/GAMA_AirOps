import axios from 'axios';
// import { useAuth } from 'src/context/AuthContext';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

// import Pagination from '@mui/material/Pagination';
import {
  Box,
  Link,
  Card,
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  Container,
  TableCell,
  Typography,
  IconButton,
  Breadcrumbs,
  TableContainer,
  TablePagination,
} from '@mui/material';

// import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import AircraftTableRow from '../aircraft-table-row';
import AircraftTableHead from '../aircraft-table-head';
import AircraftTableToolbar from '../aircraft-table-toolbar';

// ----------------------------------------------------------------------
const HEADER_LABEL = [
  // { id: 'id', label: 'Model ID' },
  { id: 'reg_no', label: 'Reg.No.' },
  { id: 'model.aircraft_type', label: 'Model' },
  { id: 'min_cabin_crew', label: 'Cabin Crew' },
  { id: 'min_flight_crew', label: 'Flight Crew' },
  { id: 'no_of_captain', label: 'Captain(s)' },
  { id: 'no_of_fo', label: 'FO(s)' },
  { id: 'c_cls_capacity', label: 'cCls Capacity' },
  { id: 'y_cls_capacity', label: 'yCls Capacity' },
  { id: 'seating_capacity', label: 'Sitting Capacity' },
  { id: 'not_in_service', label: 'In Service' },
  { id: 'not_in_service_from', label: 'Not In Service From' },
  { id: 'last_arrival.airport_name', label: 'Last Arrival' },
  // { id: 'landline', label: 'Landline', align: 'center' },
  // { id: 'creator.email', label: 'Created By' },
  // { id: 'created_at', label: 'Created At' },
  { id: '' },
];

const SEARCH_BY = [
  // { id: 'id', label: 'Model ID' },
  { id: 'reg_no', label: 'Reg.No.' },
  { id: 'model.aircraft_type', label: 'Model' },
  { id: 'min_cabin_crew', label: 'Cabin Crew' },
  { id: 'min_flight_crew', label: 'Flight Crew' },
  { id: 'no_of_captain', label: 'Captain(s)' },
  { id: 'no_of_fo', label: 'FO(s)' },
  { id: 'c_cls_capacity', label: 'cCls Capacity' },
  { id: 'y_cls_capacity', label: 'yCls Capacity' },
  { id: 'seating_capacity', label: 'Sitting Capacity' },
  { id: 'not_in_service', label: 'In Service' },
  { id: 'not_in_service_from', label: 'Not In Service From' },
  { id: 'last_arrival.airport_name', label: 'Last Arrival' },
];

export default function ListPage() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [rows, setRows] = useState([]);

  const [info, setInfo] = useState({});

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [searchField, setSearchField] = useState('reg_no');

  const [searchTerm, setSearchTerm] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [refresh, setRefresh] = useState(0);

  // console.log(selected);

  const action = useCallback(
    (snackbarId) => (
      <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
        <Iconify icon="eva:close-outline" />
      </IconButton>
    ),
    [closeSnackbar]
  );

  useEffect(() => {
    if (info.current_page) {
      setPage(info.current_page - 1);
    }
  }, [info]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(
            `/api/aircrafts?search_field=${searchField}&search_term=${searchTerm}&sort=${orderBy}&order=${order}&page=${
              page + 1
            }&size=${rowsPerPage}`
          )
          .then((response) => {
            if (response.data.status) {
              setRows(response.data.results);
              setInfo(response.data.info);
              console.log(response.data.results);
              console.log(response.data.info);
            }
          })
          .catch((error) => {
            setRows([]);
            setInfo({});
            // enqueueSnackbar(error.response.data.message, { variant: 'error', action });
          });
      } catch (error) {
        setRows([]);
        setInfo({});
        enqueueSnackbar(error.message, { variant: 'error', action });
      }
    };

    fetchData();
  }, [
    searchField,
    searchTerm,
    orderBy,
    order,
    page,
    refresh,
    rowsPerPage,
    action,
    enqueueSnackbar,
  ]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleUnSelectAllClick = () => {
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearchField = (value = 'aircraft_manufacture') => {
    setSearchField(value);
  };

  const handleSearchTerm = (event) => {
    // setSearchField('ep.employee_id');
    setPage(0);
    setSearchTerm(event.target.value);
  };

  const dataFiltered = rows;

  const notFound = !dataFiltered.length && !!searchTerm;

  // const dataFiltered = applyFilter({
  //   inputData: rows,
  //   comparator: getComparator(order, orderBy),
  //   searchTerm,
  // });

  // const notFound = !dataFiltered.length && !!searchTerm;

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/trip_management">
      Trip&nbsp;Management
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/trip_management/masters">
      Masters
    </Link>,
    <Typography key="3" color="text.disabled">
      Aircraft
    </Typography>,
    <Typography key="4" color="text.disabled">
      List
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Aircraft&nbsp;List
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
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push('/trip_management/masters/aircrafts/new')}
        >
          New&nbsp;Aircraft
        </Button>
      </Stack>

      <Card sx={{ overflow: 'visible' }}>
        <AircraftTableToolbar
          onUnselectAll={handleUnSelectAllClick}
          selected={selected}
          setSelected={setSelected}
          numSelected={selected.length}
          searchBy={SEARCH_BY}
          searchTerm={searchTerm}
          searchField={searchField}
          onSearchTerm={handleSearchTerm}
          onSearchField={handleSearchField}
          setRefresh={setRefresh}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AircraftTableHead
                order={order}
                orderBy={orderBy}
                rowCount={rows.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={HEADER_LABEL}
              />
              <TableBody>
                {dataFiltered.length < 1 && !notFound && (
                  <TableRow sx={{ height: 300 }}>
                    <TableCell colSpan={12}>
                      <Stack spacing={1}>
                        <Box
                          component="img"
                          src="/assets/icons/ic_content.svg"
                          sx={{ height: 120, mx: 'auto' }}
                        />
                        <Typography
                          textAlign="center"
                          variant="subtitle1"
                          color="text.secondary"
                          component="span"
                        >
                          No Data
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                {dataFiltered
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <AircraftTableRow
                      key={row.id}
                      aircraftId={row.id}
                      regNo={row.reg_no}
                      model={row.model.aircraft_model}
                      cabinCrew={row.min_cabin_crew}
                      flightCrew={row.min_flight_crew}
                      captains={row.no_of_captain}
                      fo={row.no_of_fo}
                      cCls={row.c_cls_capacity}
                      yCls={row.y_cls_capacity}
                      sittingCapacity={row.seating_capacity}
                      inService={row.not_in_service}
                      notInServiceFrom={
                        row.not_in_service
                          ? new Date(row.not_in_service_from).toLocaleDateString('en-GB')
                          : null
                      }
                      lastArrival={
                        row.last_arrival_airport && row.last_arrival_airport.airport_name
                      }
                      setRefresh={setRefresh}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                    />
                  ))}

                <TableEmptyRows height={98.8} emptyRows={page ? rowsPerPage - rows.length : 0} />

                {notFound && <TableNoData query={searchTerm} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={info.total_items ? info.total_items : 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* <Stack direction="row" alignItems="center" justifyContent="center" py={3} gap={15}>
          <Pagination
            showFirstButton
            showLastButton
            count={info.total_pages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        </Stack> */}
      </Card>
    </Container>
  );
}
