import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllAdmins,
  logoutAdmin,
  selectAdmins,
} from '../../store/adminSlice';
import { fetchAllContents, selectContents } from '../../store/contentSlice';
import { Toolbar, Box, Tooltip, Menu, IconButton, Avatar } from '@mui/material';
import logoImage from '../../assets/logo.svg';
import { Logout } from '@mui/icons-material';
import { Image, NavLinkButton, StyledMenuItem } from './styles';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const isSuperAdmin = useSelector((state: any) => state.admin.isSuperAdmin);
  const allContents = useSelector(selectContents);
  const allAdmins = useSelector(selectAdmins);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logoutAdmin() as any);
    navigate('/login');
  };

  const prepareContents = () => {
    if (allContents.length === 0) dispatch(fetchAllContents() as any);
    navigate('/content');
  };

  const prepareAdmins = () => {
    if (allAdmins.length === 0) dispatch(fetchAllAdmins() as any);
    navigate('/admin');
  };

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Toolbar
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: currentAdmin ? 'space-between' : 'center',
        background: theme.palette.background.default,
        boxShadow: `1px -1px 5px ${theme.palette.common.black}`,
      })}
    >
      <Image
        src={logoImage}
        alt="Logo"
        sx={{
          alignSelf: 'flex-end',
        }}
      />
      {currentAdmin && (
        <Box
          sx={{
            justifySelf: 'flex-end',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <NavLinkButton onClick={prepareContents}>Content</NavLinkButton>
          {isSuperAdmin && (
            <NavLinkButton onClick={prepareAdmins}>Admin</NavLinkButton>
          )}
          <>
            <Tooltip title="Account">
              <IconButton
                onClick={toggleMenu}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar
                  sx={(theme) => ({
                    color: theme.palette.background.default,
                    fontWeight: 600,
                    background: theme.palette.primary.main,
                    fontSize: '1rem',
                  })}
                >
                  {isSuperAdmin ? 'SA' : 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              id="account-menu"
              onClose={() => setAnchorEl(null)}
              onClick={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 0,
                sx: (theme) => ({
                  background: theme.palette.secondary.main,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 0.8,
                }),
              }}
            >
              <StyledMenuItem
                onClick={handleLogout}
                sx={{
                  fontWeight: 600,
                  padding: '0 10px',
                  fontSize: '0.9rem',
                }}
              >
                <Logout sx={{ color: 'primary', fontSize: '1rem' }} />
                <span style={{ paddingLeft: '10px' }}>Logout</span>{' '}
              </StyledMenuItem>
            </Menu>
          </>
        </Box>
      )}
    </Toolbar>
  );
}

export default Header;
