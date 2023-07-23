import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '.';
import { getAllAdmins } from '../services/admin';

export interface Admin {
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
    adminLogin: (state, action: PayloadAction<Admin>) => {
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
    setAllAdmins: (state, action: PayloadAction<Admin[]>) => {
      state.allAdmins = action.payload;
    },
    // addAdmin: (state, action: PayloadAction<Admin>) => {
    //   state.allAdmins.push(action.payload);
    // },
    // editAdmin: (state, action: PayloadAction<Admin>) => {
    //   const index = state.allAdmins.findIndex(
    //     (admin) => admin.username === action.payload.username
    //   );
    //   if (index !== -1) {
    //     state.allAdmins[index] = action.payload;
    //   }
    // },
    // deleteAdmin: (state, action: PayloadAction<string>) => {
    //   state.allAdmins = state.allAdmins.filter(
    //     (admin) => admin._id !== action.payload
    //   );
    // },
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

export const {
  adminLogin,
  adminLogout,
  setAllAdmins,
  // addAdmin,
  // editAdmin,
  // deleteAdmin,
} = adminSlice.actions;

export const fetchAllAdmins = (): AppThunk => async (dispatch, getState) => {
  try {
    const { data } = await getAllAdmins();
    const allAdmins = data.data;
    const currentAdmin = getState().admin.currentAdmin;
    const filteredAdmins = allAdmins.filter(
      (admin: Admin) => admin.username !== currentAdmin?.username
    );
    dispatch(setAllAdmins(filteredAdmins));
  } catch (error) {
    console.error('Error fetching all admins:', error);
  }
};

export const selectAdmins = (state: { admin: AdminState }) =>
  state.admin.allAdmins;

export default adminSlice.reducer;
