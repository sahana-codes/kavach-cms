import React, { useState } from 'react';
import { Credentials } from '../login';
import { validatePassword, validateUsername } from '../../utils/validators';
import { createNewAdmin, updateAdmin } from '../../services/admin';
import { fetchAllAdmins } from '../../store/adminSlice';
import { useDispatch } from 'react-redux';
import ErrorText from '../error/errorText';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { StyledButton } from '../login/styles';

type Props = {
  closeCreateForm: () => void;
  usernameToUpdate?: string;
};
interface ExtendedCredentials extends Credentials {
  confirmPassword: string;
}

function AdminForm({ closeCreateForm, usernameToUpdate }: Props) {
  const [{ username, password, confirmPassword }, setCreds] =
    useState<ExtendedCredentials>({
      username: usernameToUpdate || '',
      password: '',
      confirmPassword: '',
    });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setCreds((prevCreds) => ({
      ...prevCreds,
      [name]: value,
    }));

    if (name === 'username') {
      setError(validateUsername(value));
    } else if (name === 'password') {
      setError(validatePassword(value));
    }
    if (name === 'confirmPassword' && password !== value) {
      setError('Passwords do not match.');
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword
      );
    }
  };

  const handleCreateorUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    if (username && password) {
      if (password === confirmPassword) {
        const APIToCall = usernameToUpdate ? updateAdmin : createNewAdmin;
        try {
          const { data } = await APIToCall(username, password);
          if (data) {
            setCreds({ username: '', password: '', confirmPassword: '' });
            dispatch(fetchAllAdmins() as any);
            closeCreateForm();
          }
        } catch (error: any) {
          setError(error.message);
        }
      } else setError('Passwords do not match.');
    } else
      setError(
        username ? 'Password cannot be empty.' : 'Username cannot be empty.'
      );
  };

  return (
    <Box
      component="form"
      onSubmit={handleCreateorUpdateAdmin}
      autoComplete="off"
      sx={{
        width: '400px',
        height: '350px',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Username"
          name="username"
          id="username"
          value={username}
          onChange={handleChange}
          autoComplete="off"
          disabled={usernameToUpdate ? true : false}
        />
      </Box>
      <Box mb={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleChange}
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('password')}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <OutlinedInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        <ErrorText>
          <Typography
            dangerouslySetInnerHTML={{ __html: error }}
            sx={{ fontSize: '0.8rem', fontWeight: 600 }}
          />
        </ErrorText>
      </Box>
      <StyledButton type="submit">Submit</StyledButton>
    </Box>
  );
}

export default AdminForm;
