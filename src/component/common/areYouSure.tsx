import React from 'react';
import { StyledButton } from '../login/styles';
import { Box, Typography } from '@mui/material';

type Props = {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

const AreYouSure: React.FC<Props> = ({
  message,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '1rem',
          p: 2,
        }}
        component="p"
      >
        {message}
      </Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >
        <StyledButton
          onClick={onConfirm}
          style={{ marginRight: '10px', background: '#FF5A10' }}
        >
          Confirm
        </StyledButton>
        <StyledButton onClick={onCancel}>Cancel</StyledButton>
      </div>
    </Box>
  );
};

export default AreYouSure;
