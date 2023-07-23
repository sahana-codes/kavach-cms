import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

import { RootState } from '../../store';
import { closeSnackbar } from '../../store/snackbarSlice';

const SnackbarComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.snackbar
  );

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
