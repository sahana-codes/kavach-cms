import { styled } from '@mui/material/styles';
import { Typography, MenuItem } from '@mui/material';

export const Image = styled('img')(({ theme }) => ({
  objectFit: 'contain',
  justifySelf: 'flex-start',
  height: '60px',
  alignSelf: 'center',
}));

export const NavLinkButton = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
  '&:hover': {
    textDecoration: 'underline', // Add underline on hover
  },
  cursor: 'pointer',
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    background: 'transparent',
  },
}));
