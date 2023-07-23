import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

type Props = { children: ReactNode };

function Wrapper({ children }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
}

export default Wrapper;
