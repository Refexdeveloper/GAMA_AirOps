import axios from 'axios';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
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

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ----------------------------------------------------------------------

export default function SheetTableRow({
  sheetId,
  customerName,
  aircraft,
  flightManager,
  operationManager,
  fileName,
  createdBy,
  createdAt,
  setRefresh,
  selected,
  handleClick,
}) {
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
    router.push(`/sales_management/flight_brief_sheet/${sheetId}`);
  };

  const handleClickEdit = () => {
    router.push(`/sales_management/flight_brief_sheet/${sheetId}/edit`);
  };

  const handleClickDownload = async () => {
    try {
      const response = await axios.get(`/api/download_brief_sheet/${sheetId}`, {
        responseType: 'blob', // Important!
      });
      saveAs(response.data, `SAPL_FBS-${String(sheetId).padStart(4, '0')}.pdf`);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', action });
    }
  };

  const handleClickDelete = () => {
    try {
      axios
        .post('/api/delete_brief_sheet', { sheet_ids: [sheetId] })
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
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

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
            {`SAPL/FBS-${String(sheetId).padStart(4, '0')}`}
          </Typography>
        </TableCell>
        <TableCell>{customerName}</TableCell>

        <TableCell>{aircraft}</TableCell>

        <TableCell>{flightManager}</TableCell>

        <TableCell>{operationManager}</TableCell>

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
        {fileName && (
          <MenuItem
            onClick={() => {
              handleClickDownload();
              handleCloseMenu();
            }}
          >
            <Iconify icon="solar:download-bold-duotone" sx={{ mr: 2 }} />
            Download
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleClickView();
            handleCloseMenu();
          }}
        >
          <Iconify icon="solar:eye-bold-duotone" sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClickEdit();
            handleCloseMenu();
          }}
        >
          <Iconify icon="solar:pen-bold-duotone" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

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

SheetTableRow.propTypes = {
  sheetId: PropTypes.number,
  customerName: PropTypes.any,
  aircraft: PropTypes.any,
  flightManager: PropTypes.any,
  operationManager: PropTypes.any,
  fileName: PropTypes.any,
  createdBy: PropTypes.any,
  createdAt: PropTypes.any,
  setRefresh: PropTypes.any,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};
