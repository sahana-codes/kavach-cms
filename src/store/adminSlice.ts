import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '.';

interface Admin {
  _id?: string;
  username: string;
}

interface AdminState {
  isSuperAdmin: boolean;
  currentAdmin: Admin | null;
  allAdmins: Admin[];
}

const initialState: AdminState = {
  isSuperAdmin: false,
  currentAdmin: null,
  allAdmins: [],
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLogin: (state, action) => {
      const { username, _id } = action.payload;
      if (username === 'kavach_superuser') {
        state.isSuperAdmin = true;
      }
      state.currentAdmin = { username, _id };
    },
    adminLogout: (state) => {
      state.currentAdmin = null;
      state.isSuperAdmin = false;
    },
  },
});

export const logoutAdmin = () => {
  return (dispatch: AppDispatch) => {
    // Clear the localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentAdmin');

    // Dispatch the adminLogout action
    dispatch(adminLogout());
  };
};

export const { adminLogin, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;
