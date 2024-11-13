// useToast.js
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // success, error, etc.

  const showToast = (message, severity = 'success') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  const ToastComponent = (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={hideToast} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

  return {
    showToast,
    ToastComponent,
  };
};
