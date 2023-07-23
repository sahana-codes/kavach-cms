import { ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  background: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  fontWeight: 600,
  padding: '20px',
  borderRadius: '8px',
  height: '45px',
}));
