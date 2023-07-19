import React, { useState } from 'react';
import { Credentials } from '../login';
import { validatePassword, validateUsername } from '../../utils/validators';
import { createNewAdmin, updateAdmin } from '../../services/admin';
type Props = {
  fetchAdmins: () => Promise<void>;
  closeCreateForm: () => void;
  usernameToUpdate?: string;
};
function AdminForm({ fetchAdmins, closeCreateForm, usernameToUpdate }: Props) {
  const [{ username, password, confirmPassword }, setCreds] =
    useState<Credentials>({
      username: usernameToUpdate || '',
      password: '',
      confirmPassword: '',
    });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
            fetchAdmins();
            closeCreateForm();
          }
        } catch (error: any) {
          setError(error.message);
        }
      } else setError('Passwords do not match');
    } else
      setError(
        username ? 'Password cannot be empty.' : 'Username cannot be empty.'
      );
  };

  return (
    <>
      <button onClick={closeCreateForm}>Close X</button>
      <form onSubmit={handleCreateorUpdateAdmin} autoComplete="off">
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={handleChange}
            autoComplete="off"
            readOnly={usernameToUpdate ? true : false}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
            autoComplete="off"
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
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            autoComplete="off"
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {error && <div dangerouslySetInnerHTML={{ __html: error }} />}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default AdminForm;
