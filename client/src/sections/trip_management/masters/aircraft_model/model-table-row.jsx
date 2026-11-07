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

export default function ModelTableRow({
  modelId,
  manufacture,
  model,
  type,
  pilots,
  seats,
  cruisingSpeed,
  perHourCost,
  baseAirport,
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

  const handleClickView = () => {
    router.push(`/trip_management/masters/aircraft_models/${modelId}`);
  };

  const handleClickEdit = () => {
    router.push(`/trip_management/masters/aircraft_models/${modelId}/edit`);
  };

  const handleClickDelete = () => {
    try {
      axios
        .post('/api/delete_aircraft_models', { model_ids: [modelId] })
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

        {/* <TableCell>
          <Typography
            variant="subtitle1"
            noWrap
            onClick={handleClickView}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                textDecoration: 'underline',
              },
            }}
          >
            {fID('AM', modelId)}
          </Typography>
        </TableCell> */}

        <TableCell>
          <Typography
            variant="subtitle1"
            noWrap
            onClick={handleClickView}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                textDecoration: 'underline',
              },
            }}
          >
            {model}
          </Typography>
        </TableCell>
        <TableCell>{manufacture}</TableCell>

        <TableCell>{type}</TableCell>

        <TableCell>{pilots}</TableCell>

        <TableCell>{seats}</TableCell>

        <TableCell>{cruisingSpeed}</TableCell>

        <TableCell>{perHourCost}</TableCell>

        <TableCell>{baseAirport}</TableCell>

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
        <MenuItem
          onClick={() => {
            handleClickView();
            handleCloseMenu();
          }}
        >
          <Iconify icon="solar:eye-bold-duotone" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {user.role !== 'User' && (
          <MenuItem
            onClick={() => {
              handleClickEdit();
              handleCloseMenu();
            }}
          >
            <Iconify icon="solar:pen-bold-duotone" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

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

ModelTableRow.propTypes = {
  modelId: PropTypes.number,
  manufacture: PropTypes.any,
  model: PropTypes.any,
  type: PropTypes.any,
  pilots: PropTypes.any,
  seats: PropTypes.any,
  cruisingSpeed: PropTypes.any,
  perHourCost: PropTypes.any,
  baseAirport: PropTypes.any,
  createdBy: PropTypes.any,
  createdAt: PropTypes.any,
  setRefresh: PropTypes.any,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};
