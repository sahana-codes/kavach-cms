import {
  // createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  AppDispatch,
  // RootState
} from '.';

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
  // extraReducers: (builder) => {
  //   builder.addCase(loadCurrentAdmin.fulfilled, (state, action) => {
  //     const payload = action.payload as Admin | null;
  //     if (payload) {
  //       const { username, _id } = payload;
  //       state.isSuperAdmin = username === 'kavach_superuser';
  //       state.currentAdmin = { username, _id };
  //     } else {
  //       state.currentAdmin = null;
  //     }
  //   });
  // },
});

// export const loadCurrentAdmin = createAsyncThunk<Admin | void>(
//   'admin/loadCurrentAdmin',
//   async (_, { dispatch }) => {
//     const currentAdminData = localStorage.getItem('currentAdmin');
//     if (currentAdminData) {
//       const adminData = JSON.parse(currentAdminData) as Admin;
//       dispatch(adminLogin(adminData));
//     } else {
//       // Clear the admin state if no admin data found in localStorage
//       dispatch(adminLogout());
//     }
//   }
// );

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
