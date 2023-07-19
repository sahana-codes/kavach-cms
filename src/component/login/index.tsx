import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin, login } from '../../services/admin';
import { adminLogin } from '../../store/adminSlice';
import { useDispatch } from 'react-redux';
import { validatePassword, validateUsername } from '../../utils/validators';

export interface Credentials {
  username: string;
  password: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const [{ username, password, confirmPassword }, setCreds] =
    useState<Credentials>({
      username: '',
      password: '',
      confirmPassword: '',
    });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
    } else if (name === 'confirmPassword') {
      setError(validatePassword(value));
    }
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
      if (confirmPassword === password)
        try {
          const { data } = await login(username, password);
          if (data) {
            const { data } = await getCurrentAdmin();
            dispatch(adminLogin({ ...data.data }));
            localStorage.setItem(
              'currentAdmin',
              JSON.stringify({ ...data.data })
            );
            navigate('/content');
          }
        } catch (error: any) {
          setError(error.message);
        }
      else setError('Passwords do not match');
    } else
      setError(
        username ? 'Password cannot be empty.' : 'Username cannot be empty.'
      );
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleChange}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {error && <div dangerouslySetInnerHTML={{ __html: error }} />}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
