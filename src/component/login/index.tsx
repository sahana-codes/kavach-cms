import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin, login } from '../../services/admin';
import { adminLogin } from '../../store/adminSlice';
import { useDispatch } from 'react-redux';
import { fetchAllContents } from '../../store/contentSlice';
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { StyledButton } from './styles';
import ErrorText from '../error/errorText';

export interface Credentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [{ username, password }, setCreds] = useState<Credentials>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setCreds((prevCreds) => ({
      ...prevCreds,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      return;
    }
    if (username && password) {
      try {
        setLoading(true);
        const { data } = await login(username, password);
        if (data) {
          const { data } = await getCurrentAdmin();
          dispatch(adminLogin({ ...data.data }));
          localStorage.setItem(
            'currentAdmin',
            JSON.stringify({ ...data.data })
          );
          dispatch(fetchAllContents() as any);
          navigate('/content');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError(
        username ? 'Password cannot be empty.' : 'Username cannot be empty.'
      );
    }
  };

  return (
    <Box maxWidth="400px" mx="auto" mt="100px">
      <Typography variant="h4" align="center" gutterBottom>
        Login to Kavach CMS
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Username"
          name="username"
          value={username}
          onChange={handleChange}
          error={!!error && !username}
          helperText={error && !username ? error : ''}
          margin="normal"
        />
        <FormControl
          fullWidth
          variant="outlined"
          error={!!error && !password}
          margin="normal"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

          <ErrorText>{error}</ErrorText>
        </FormControl>
        <StyledButton
          type="submit"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, fontSize: '0.8rem', width: '100%' }}
        >
          {loading ? (
            <CircularProgress size={17} color="secondary" />
          ) : (
            'Continue'
          )}
        </StyledButton>
      </form>
    </Box>
  );
};

export default Login;
