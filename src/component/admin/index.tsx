import React, { useState } from 'react';
import { deleteAdmin } from '../../services/admin';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { fetchAllAdmins, selectAdmins } from '../../store/adminSlice';
import ModalContent from '../common/modalContent';
import { openSnackbar } from '../../store/snackbarSlice';
import { StyledButton } from '../login/styles';

const AdminForm = React.lazy(() => import('./adminForm'));
const AdminTable = React.lazy(() => import('./adminTable'));
const AreYouSure = React.lazy(() => import('../common/areYouSure'));

const Admin: React.FC = () => {
  const admins = useSelector(selectAdmins);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usernameToUpdate, setUsernameToUpdate] = useState('');
  const [adminToDelete, setAdminToDelete] = useState('');
  const dispatch = useDispatch();

  const handleUpdateAdmin = (username: string) => {
    setShowCreateForm(true);
    setUsernameToUpdate(username);
  };

  const openConfirmDelete = (username: string) => {
    setAdminToDelete(username);
    setShowConfirmDelete(true);
  };

  const handleDeleteAdmin = async () => {
    try {
      const { data } = await deleteAdmin(adminToDelete);
      if (data) {
        dispatch(fetchAllAdmins() as any);
        setShowConfirmDelete(false);
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          message: 'Error occurred while deleting admin',
          severity: 'error',
        })
      );
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" my="50px" p={2}>
      <StyledButton onClick={() => setShowCreateForm(true)} sx={{ mb: 2 }}>
        Create New Admin
      </StyledButton>
      {showCreateForm && (
        <ModalContent
          title="Create Admin"
          open={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setUsernameToUpdate('');
          }}
        >
          <React.Suspense fallback={<CircularProgress />}>
            <AdminForm
              closeCreateForm={() => {
                setShowCreateForm(false);
                setUsernameToUpdate('');
              }}
              usernameToUpdate={usernameToUpdate}
            />
          </React.Suspense>
        </ModalContent>
      )}
      <React.Suspense fallback={<CircularProgress />}>
        <AdminTable
          admins={admins}
          handleUpdateAdmin={handleUpdateAdmin}
          openConfirmDelete={openConfirmDelete}
        />
      </React.Suspense>
      {showConfirmDelete && adminToDelete && (
        <ModalContent
          title="Confirm Delete"
          open={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
        >
          <React.Suspense fallback={<CircularProgress />}>
            <AreYouSure
              onCancel={() => setShowConfirmDelete(false)}
              message={adminToDelete}
              onConfirm={handleDeleteAdmin}
            />
          </React.Suspense>
        </ModalContent>
      )}
    </Box>
  );
};

export default Admin;
