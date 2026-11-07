/* eslint-disable import/no-unresolved */
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState, forwardRef, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  Slide,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/context/AuthContext';

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ----------------------------------------------------------------------

export default function AirportTableRow({
  airportId,
  airport,
  city,
  country,
  iata,
  icao,
  critical,
  alertable,
  createdBy,
  createdAt,
  setRefresh,
  selected,
  handleClick,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [openMenu, setOpenMenu] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const action = useCallback(
    (snackbarId) => (
      <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)}>
        <Iconify icon="eva:close-outline" />
      </IconButton>
    ),
    [closeSnackbar]
  );

  // const handleClickView = () => {
  //   router.push(`/trip_management/masters/airport/${airportId}`);
  // };

  const handleClickEdit = () => {
    router.push(`/trip_management/masters/airport/${airportId}/edit`);
  };

  const handleClickDelete = () => {
    try {
      axios
        .post('/api/delete_airport', { airport_ids: [airportId] })
        .then((response) => {
          if (response.data.status) {
            enqueueSnackbar(response.data.message, { variant: 'warning', action });
            setRefresh((prev) => prev + 1);
          }
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.message, { variant: 'error', action });
        });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', action });
    }
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        // onClick={handleClick}
        // sx={{ cursor: 'pointer' }}
      >
        {user.role !== 'User' && (
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          </TableCell>
        )}

        <TableCell>
          <Typography
            variant="subtitle1"
            noWrap
            onClick={handleClickEdit}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                textDecoration: 'underline',
              },
            }}
          >
            {/* {`SAPL/AP-${String(airportId).padStart(4, '0')}`} */}
            {airport}
          </Typography>
        </TableCell>
        {/* <TableCell>{airport}</TableCell> */}

        <TableCell>{city}</TableCell>

        <TableCell>{country}</TableCell>

        <TableCell>{iata}</TableCell>

        <TableCell>{icao}</TableCell>

        <TableCell>{critical ? 'Yes' : 'No'}</TableCell>

        <TableCell>{alertable ? 'Yes' : 'No'}</TableCell>

        <TableCell>{createdBy}</TableCell>

        <TableCell>{createdAt}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {/* <MenuItem
          onClick={() => {
            handleClickView();
            handleCloseMenu();
          }}
        >
          <Iconify icon="solar:eye-bold-duotone" sx={{ mr: 2 }} />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleClickEdit();
            handleCloseMenu();
          }}
        >
          <Iconify icon="solar:pen-bold-duotone" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {user.role !== 'User' && (
          <MenuItem
            onClick={() => {
              handleClickOpenAlert();
              handleCloseMenu();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold-duotone" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleClickDelete();
              handleCloseAlert();
            }}
          >
            Delete
          </Button>
          <Button variant="outlined" onClick={handleCloseAlert}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AirportTableRow.propTypes = {
  airportId: PropTypes.number,
  airport: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  iata: PropTypes.string,
  icao: PropTypes.string,
  critical: PropTypes.bool,
  alertable: PropTypes.bool,
  createdBy: PropTypes.any,
  createdAt: PropTypes.any,
  setRefresh: PropTypes.any,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};
