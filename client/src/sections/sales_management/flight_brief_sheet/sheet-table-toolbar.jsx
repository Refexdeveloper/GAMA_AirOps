/* eslint-disable import/no-unresolved */
import axios from 'axios';
import PropTypes from 'prop-types';
// import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import { useState, forwardRef, useCallback } from 'react';

import {
  //   Box,
  Stack,
  Slide,
  Badge,
  Button,
  Dialog,
  Toolbar,
  TextField,
  IconButton,
  //   Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  OutlinedInput,
  InputAdornment,
  //   CircularProgress,
  DialogContentText,
} from '@mui/material';

// import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function SheetTableToolbar({
  onUnselectAll,
  selected,
  setSelected,
  numSelected,
  searchBy,
  searchTerm,
  searchField,
  onSearchTerm,
  onSearchField,
  setRefresh,
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //   const fileInput = useRef(null);
  //   const [openImport, setOpenImport] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  //   const [selectedFile, setSelectedFile] = useState(null);
  //   const [fileInfo, setFileInfo] = useState(null);
  //   const [openProgress, setOpenProgress] = useState(false);

  //   const handleCloseProgress = () => {
  //     setOpenProgress(false);
  //   };
  //   const handleOpenProgress = () => {
  //     setOpenProgress(true);
  //   };

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];

  //     setSelectedFile(file);
  //     setFileInfo(file ? { name: file.name, size: file.size } : null);
  //   };

  //   const handleFileDrop = (event) => {
  //     event.preventDefault();

  //     if (event.dataTransfer.items && event.dataTransfer.items[0]) {
  //       const file = event.dataTransfer.items[0].getAsFile();

  //       setSelectedFile(file);
  //       setFileInfo(file ? { name: file.name, size: file.size } : null);
  //     }
  //   };

  //   const handleFileUpload = () => {
  //     if (selectedFile) {
  //       const formData = new FormData();
  //       formData.append('file', selectedFile);
  //       // formData.append('createdBy', loggedUser.user_id);
  //       axios
  //         .post('/api/import_aircraft_models', formData)
  //         .then((response) => {
  //           setTimeout(() => {
  //             console.log(response.data);
  //             enqueueSnackbar(
  //               `${response.data.message} (Imported Rows: ${response.data.results.successData.length}, Failed Rows: ${response.data.results.failureData.length})`,
  //               { variant: 'success', action }
  //             );
  //             handleCloseProgress();
  //             setRefresh((prev) => prev + 1);
  //             // setTimeout(() => {
  //             //   setRefresh((prev) => prev + 1);
  //             // }, 1000);
  //           }, 3000);
  //           // Handle success, e.g., show a success message to the user
  //         })
  //         .catch((error) => {
  //           setTimeout(() => {
  //             console.error('Error uploading file:', error);
  //             if (error.response.status === 400) {
  //               enqueueSnackbar(
  //                 `${error.response.data.message} (Imported Rows: ${error.response.data.results.successData.length}, Failed Rows: ${error.response.data.results.failureData.length})`,
  //                 { variant: 'error', action }
  //               );
  //             } else {
  //               enqueueSnackbar(error.response.data.message, { variant: 'error', action });
  //             }
  //             handleCloseProgress();
  //           }, 3000);
  //           // Handle errors, e.g., show an error message to the user
  //         });
  //     } else {
  //       setTimeout(() => {
  //         handleCloseProgress();
  //       }, 3000);
  //       console.error('No file selected');
  //     }
  //   };

  //   const handleClickExport = async () => {
  //     try {
  //       const response = await axios.get('/api/export_aircraft_models', { responseType: 'blob' });
  //       const blob = new Blob([response.data], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       });
  //       saveAs(blob, 'AircraftModels.xlsx');
  //     } catch (error) {
  //       enqueueSnackbar(error.response.data.message, { variant: 'error', action });
  //     }
  //   };

  //   const handleClickFileUpload = () => {
  //     fileInput.current.click();
  //   };

  //   const handleDragOver = (event) => {
  //     event.preventDefault();
  //   };

  //   const handleClickOpenImport = () => {
  //     setOpenImport(true);
  //   };

  //   const handleCloseImport = (event, reason) => {
  //     if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
  //     setFileInfo(null);
  //     setSelectedFile(null);
  //     setOpenImport(false);
  //   };

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

  const handleClickDelete = () => {
    try {
      axios
        .post('/api/delete_brief_sheet', { sheet_ids: selected })
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            enqueueSnackbar(response.data.message, { variant: 'warning', action });
            setRefresh((prev) => prev + 1);
            setSelected([]);
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
    <Toolbar
      sx={{
        // height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: 3,
        // p: (theme) => theme.spacing(0, 1, 0, 3),
        // ...(numSelected > 0 && {
        //   color: 'primary.main',
        //   bgcolor: 'primary.lighter',
        // }),
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} width={1}>
        <Autocomplete
          disablePortal
          disableClearable
          options={searchBy}
          value={searchBy.find((_fb) => _fb.id === searchField) || null}
          onChange={(event, newValue) => {
            if (newValue) onSearchField(newValue.id);
            else onSearchField();
          }}
          sx={{ width: { xs: 1, sm: 300 } }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} width={1}>
          <OutlinedInput
            value={searchTerm}
            onChange={onSearchTerm}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
            fullWidth
            // sx={{ width: 600 }}
          />
          {
            numSelected > 0 ? (
              <Stack direction="row" gap={2}>
                <Button
                  onClick={handleClickOpenAlert}
                  color="error"
                  endIcon={
                    <Badge badgeContent={numSelected} color="error">
                      <Iconify icon="solar:trash-bin-trash-bold-duotone" />
                    </Badge>
                  }
                >
                  Delete&nbsp;All
                </Button>
                <Button
                  onClick={onUnselectAll}
                  endIcon={
                    <Badge badgeContent={numSelected} color="primary">
                      <Iconify icon="eva:close-fill" />
                    </Badge>
                  }
                >
                  Unselect&nbsp;All
                </Button>
                {/* <Tooltip title="Send Print Request">
            <IconButton onClick={handleSendPrintRequest}>
              <Badge badgeContent={numSelected} color="primary">
                <Iconify icon="iconamoon:send-fill" />
              </Badge>
            </IconButton>
          </Tooltip> */}
                {/* <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip> */}
              </Stack>
            ) : null
            //             <Stack direction="row" gap={2}>
            //               {/* <Button  startIcon={<Iconify icon="solar:eye-bold" />}>
            //   Columns
            // </Button>
            // <Button  startIcon={<Iconify icon="solar:filter-bold" />}>
            //   Filters
            // </Button> */}
            //               <Button
            //                 onClick={handleClickOpenImport}
            //                 startIcon={<Iconify icon="solar:import-bold" />}
            //               >
            //                 Import
            //               </Button>
            //               <Button onClick={handleClickExport} startIcon={<Iconify icon="solar:export-bold" />}>
            //                 Export
            //               </Button>
            //             </Stack>
          }
        </Stack>
      </Stack>

      {/* <Dialog
        open={openImport}
        onClose={handleCloseImport}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleOpenProgress();
            handleFileUpload();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries(formData.entries());
            // const email = formJson.email;
            // console.log(selectedFile);
            handleCloseImport();
          },
        }}
      >
        <DialogTitle>Import Aircraft Models</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To import aircraft model details, Please drag and drop or select the *.xlsx, *xls, *.csv
            file here.
          </DialogContentText>
          <Box
            onClick={handleClickFileUpload}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            sx={{
              mt: '10px',
              p: '20px',
              border: '2px dashed #ccc',
              borderRadius: '5px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input
              type="file"
              ref={fileInput}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {fileInfo ? (
              <Stack direction="column" spacing={1}>
                <Box
                  component="img"
                  src="/assets/files_icons/ic_excel.svg"
                  alt="icon"
                  sx={{ height: 100, mx: 'auto' }}
                />
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6" display="block">
                    {fileInfo.name}
                  </Typography>
                  <Typography variant="body2" display="block">
                    {`Size:${fData(fileInfo.size)}`}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Stack direction="column" spacing={1}>
                <Box
                  component="img"
                  src="/assets/illustrations/file_upload.svg"
                  sx={{ height: 100, mx: 'auto' }}
                />
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6" display="block">
                    Drop or Select file
                  </Typography>
                  <Typography variant="body2" display="block">
                    Drop files here or click
                    <Box
                      component="span"
                      mx="4px"
                      sx={{ textDecoration: 'underline', color: 'blue' }}
                    >
                      browse
                    </Box>
                    thorough your machine
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {fileInfo && (
            <Button variant="contained" type="submit">
              Import
            </Button>
          )}

          <Button variant="contained" color="error" onClick={handleCloseImport}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openProgress} onClose={handleCloseProgress}>
        <DialogTitle>Importing Employees...!</DialogTitle>
        <DialogContent>
          <Box
            sx={{ color: 'blue', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <CircularProgress color="inherit" />
          </Box>
        </DialogContent>
      </Dialog> */}

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
          <DialogContentText>Are you sure want to delete {numSelected} items?</DialogContentText>
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
    </Toolbar>
  );
}

SheetTableToolbar.propTypes = {
  onUnselectAll: PropTypes.func,
  selected: PropTypes.array,
  setSelected: PropTypes.any,
  numSelected: PropTypes.number,
  searchBy: PropTypes.array,
  searchTerm: PropTypes.string,
  searchField: PropTypes.string,
  onSearchTerm: PropTypes.func,
  onSearchField: PropTypes.func,
  setRefresh: PropTypes.func,
};
