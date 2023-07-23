import { Box, Modal, Typography, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { ReactNode } from 'react';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  open: boolean;
};

function ModalContent({ title, open, onClose, children }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      <Box
        sx={{
          bgcolor: 'secondary.main',
          boxShadow: 24,
          p: '10px 30px',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            sx={{ flex: 1, ml: 1, fontWeight: 600, fontSize: '1.1rem' }}
          >
            {title}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mt: 1, mb: 0 }} />

        <Box sx={{ p: 1 }}>{children}</Box>
      </Box>
    </Modal>
  );
}

export default ModalContent;
