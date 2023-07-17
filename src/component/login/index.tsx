import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin, login } from '../../services/admin';
import {
  adminLogin,
  // loadCurrentAdmin
} from '../../store/adminSlice';
import { useDispatch } from 'react-redux';

interface Credentials {
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(loadCurrentAdmin() as any);
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setCreds((prevCreds) => ({
      ...prevCreds,
      [name]: value,
    }));

    if (name === 'username') {
      validateUsername(value);
    } else if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(username)) {
      setError(
        'Only alphabets, numbers, hypen (-), and underscore (_) are allowed.'
      );
    } else {
      setError('');
    }
  };

  const validatePassword = (password: string) => {
    const criteria: { name: string; regex: RegExp }[] = [
      { name: '8 characters', regex: /^.{8,}$/ },
      { name: 'an uppercase alphabet', regex: /^(?=.*[A-Z])/ },
      { name: 'a lowercase alphabet', regex: /^(?=.*[a-z])/ },
      { name: 'a number', regex: /^(?=.*\d)/ },
      { name: 'a special character', regex: /^(?=.*[@$!%*?&])/ },
    ];

    const missingCriteria = criteria.filter(
      ({ regex }) => !regex.test(password)
    );

    setError(
      missingCriteria.length > 0
        ? `Password should contain at least: ${missingCriteria
            .map(({ name }) => name)
            .join(', ')}`
        : ''
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      return;
    }

    try {
      const { data } = await login(username, password);
      if (data) {
        const response = await getCurrentAdmin();
        dispatch(adminLogin({ ...response.data.data }));
        localStorage.setItem(
          'currentAdmin',
          JSON.stringify({ ...response.data.data })
        );
        navigate('/content');
      }
    } catch (error: any) {
      setError(error.message);
    }
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
        {error && <div dangerouslySetInnerHTML={{ __html: error }} />}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
