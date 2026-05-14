import { Snackbar, Alert } from '@mui/material';


const ToastContainer = ({ toast, onClose, autoHideDuration = 3000 }) => {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={toast.severity} 
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastContainer;
