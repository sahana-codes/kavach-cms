import { ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
interface StyledButtonProps {
  fullWidth?: boolean;
}

export const StyledButton = styled(ButtonBase)<StyledButtonProps>(
  ({ theme, fullWidth }) => ({
    width: fullWidth ? '100%' : 'auto',
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    fontWeight: 600,
    padding: '20px',
    borderRadius: '8px',
    height: '45px',
  })
);
