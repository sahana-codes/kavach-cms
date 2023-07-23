import { styled } from '@mui/material/styles';
import { Typography, MenuItem } from '@mui/material';

type NavTextProps = {
  isactive: string;
};

export const Image = styled('img')(({ theme }) => ({
  objectFit: 'contain',
  justifySelf: 'flex-start',
  height: '60px',
  alignSelf: 'center',
}));

export const NavText = styled(Typography)<NavTextProps>(
  ({ theme, isactive }) => ({
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600,
    textDecoration: 'none', // Remove standard underline
    position: 'relative', // Add relative positioning
    cursor: 'pointer',

    '&::after': {
      // Add a line below the text
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: -2, // Adjust the distance of the line from the text
      width: '100%',
      borderBottom:
        isactive === 'true'
          ? `2px solid ${theme.palette.primary.main}`
          : 'none', // Show line for active NavText
    },
  })
);

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    background: 'transparent',
  },
}));
