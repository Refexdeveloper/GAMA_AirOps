import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

// import { account } from 'src/_mock/account';
import { useAuth } from 'src/context/AuthContext';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import {  UserPasswordChange, UserProfileEdit } from 'src/sections/admin/user/view';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const { user } = useAuth();
  const fName = user.full_name.split(' ');
  const initials = fName[0].charAt(0) + fName[1].charAt(0);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);



  const MENU_OPTIONS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'eva:home-fill',
  },
    {
    label: 'Profile',
     type: 'dialog',
    icon: 'eva:home-fill',
  },

  {
    label: 'Administration',
    path: '/admin',
    icon: 'eva:home-fill',
  },
    {
    label: 'Change Password',
    type:"changePassword",
    icon: 'eva:home-fill',
  },
  // {
  //   label: 'Profile',
  //   path: '/profile',
  //   icon: 'eva:person-fill',
  // },
  // {
  //   label: 'Settings',
  //   path: '/settings',
  //   icon: 'eva:settings-2-fill',
  // },
];

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMenuClick = (item) => {
  if (item.type === 'dialog') {
    setOpenProfileDialog(true);
       handleClose();
  } 
  else if(item.type === "changePassword"){
     setOpenPasswordDialog(true);
       handleClose();
  }
  else if (item.path) {
    // navigate to the route

                router.push(item.path);
                handleClose();
              
  }
};

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user.photo}
          alt={user.full_name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {initials.toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.full_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => {
          if (option.label === 'Administration' && user.role !== 'SuperAdmin') return null;
          return (
            <MenuItem
              key={option.label}
              onClick={()=>handleMenuClick(option)}
            >
              {option.label}
            </MenuItem>
          );
        })}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={() => router.push('/logout')}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>


      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth
       maxWidth="md"
       PaperProps={{
    sx: {
      mt: 4, // margin top (you can adjust this)
    },
  }} >
  <DialogTitle>Edit Profile</DialogTitle>
  <DialogContent>
    <UserProfileEdit setOpenProfileDialog={setOpenProfileDialog}/>
  </DialogContent>
</Dialog>

  <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth
     
       PaperProps={{
    sx: {
      mt: 4,  
    },
  }} >
  <DialogTitle>Change Password</DialogTitle>
  <DialogContent>
    <UserPasswordChange setOpenPasswordDialog={setOpenPasswordDialog} is_admin={false} userId={user.id}/>
  </DialogContent>
</Dialog>
    </>
  );
}
