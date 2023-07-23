import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

type Props = { children: ReactNode };

function Wrapper({ children }: Props) {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: '#FFFFFF',
      }}
    >
      {children}
    </Box>
  );
}

export default Wrapper;
