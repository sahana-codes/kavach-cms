import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';

type ErrorProps = {
  message?: string;
  children?: ReactNode;
};

const ErrorText: React.FC<ErrorProps> = ({ message, children }) => {
  if (message || children)
    return (
      <Typography
        sx={{
          color: 'error.main',
          fontWeight: 600,
          marginTop: '4px',
          fontSize: '0.8rem',
          ml: 0,
        }}
      >
        {message}
        {children && children}
      </Typography>
    );
  else return null;
};

export default ErrorText;
