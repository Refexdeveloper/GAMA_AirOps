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
  Stack,
  Dialog,
  Button,
  Avatar,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/context/AuthContext';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import PasswordEditPage from './view/change-password';


const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ----------------------------------------------------------------------

export default function UserTableRow({
  userId,
  name,
  email,
  avatarUrl,
  phone,
  role,
  isVerified,
  isActive,
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
  const [passwordChange, setPasswordChange] = useState(false);



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
    router.push(`/admin/user/${userId}`);
  };

  const handleClickEdit = () => {
    router.push(`/admin/user/${userId}/edit`);
  };

  const handleClickDelete = () => {
    try {
      axios
        .delete(`/api/users/${userId}`,)
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
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <ListItemText
              sx={{ m: 0 }}
              primary={
                <Typography
                  variant="subtitle2"
                  noWrap
                  onClick={handleClickView}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {name}
                </Typography>
                // <Typography variant="subtitle2" noWrap>
                //   {name}
                // </Typography>
              }
              secondary={email}
            />
          </Stack>
        </TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell>

        <TableCell>
          <Label color={(!isActive && 'error') || 'success'}>
            {isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

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
          sx: { width: 200 },
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
               setPasswordChange(true)
            }}
          >
            <Iconify icon="solar:password-bold-duotone" sx={{ mr: 2 }} />
            Change Password
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


      <Dialog open={passwordChange} onClose={() => setPasswordChange(false)} fullWidth
           
             PaperProps={{
          sx: {
            mt: 4,
          },
        }} >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <PasswordEditPage setOpenPasswordDialog={setPasswordChange} is_admin={user.role !=="user"} userId={userId}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  userId: PropTypes.number,
  avatarUrl: PropTypes.any,
  phone: PropTypes.any,
  isVerified: PropTypes.bool,
  isActive: PropTypes.bool,
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  createdBy: PropTypes.string,
  createdAt: PropTypes.any,
  selected: PropTypes.any,
  setRefresh: PropTypes.any,
  handleClick: PropTypes.func,
};
