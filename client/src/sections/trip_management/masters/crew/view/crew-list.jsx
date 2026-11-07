/* eslint-disable import/no-unresolved */
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
import ModelTableRow from '../crew-table-row';
import ModelTableHead from '../crew-table-head';
import TableEmptyRows from '../table-empty-rows';
import ModelTableToolbar from '../crew-table-toolbar';

// ----------------------------------------------------------------------
const HEADER_LABEL = [
  // { id: 'id', label: 'Model ID' },
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'city', label: 'City' },
  { id: 'designation', label: 'Designation' },
  { id: 'not_it_service', label: 'In Service' },
  { id: 'not_it_service_from', label: 'Not In Service From' },
  // { id: 'base_airport.airport_name', label: 'Base Airport' },
  // { id: 'landline', label: 'Landline', align: 'center' },
  { id: 'creator.full_name', label: 'Created By' },
  { id: 'created_at', label: 'Created At' },
  { id: '' },
];

const SEARCH_BY = [
  // { id: 'id', label: 'Model ID' },
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'city', label: 'City' },
  { id: 'designation', label: 'Designation' },
  { id: 'not_it_service', label: 'In Service' },
  { id: 'not_it_service_from', label: 'Not In Service From' },
  { id: 'creator.full_name', label: 'Created By' },
  { id: 'created_at', label: 'Created At' },
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

  const [searchField, setSearchField] = useState('id');

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
            `/api/crew?search_field=${searchField}&search_term=${searchTerm}&sort=${orderBy}&order=${order}&page=${
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
      Crew
    </Typography>,
    <Typography key="4" color="text.disabled">
      List
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Crew&nbsp;List
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
          onClick={() => router.push('/trip_management/masters/crew/new')}
        >
          New&nbsp;Crew
        </Button>
      </Stack>

      <Card sx={{ overflow: 'visible' }}>
        <ModelTableToolbar
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
              <ModelTableHead
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
                    <ModelTableRow
                      key={row.id}
                      crewId={row.id}
                      name={row.name}
                      code={row.code}
                      city={row.city}
                      designation={row.designation}
                      not_in_service={row.not_it_service}
                      not_in_servicce_from={new Date(row.created_at).toLocaleString('en-GB')}
                      createdBy={row.creator.full_name}
                      createdAt={new Date(row.created_at).toLocaleString('en-GB')}
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
