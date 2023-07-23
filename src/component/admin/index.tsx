import React, { useState } from 'react';
import { deleteAdmin } from '../../services/admin';
import { useDispatch, useSelector } from 'react-redux';
import AdminForm from './adminForm';
import AreYouSure from '../common/areYouSure';
import AdminTable from './adminTable';
import { fetchAllAdmins, selectAdmins } from '../../store/adminSlice';
import ModalContent from '../common/modalContent';

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
      console.error('Error occurred while deleting admin:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowCreateForm(true)}>Create New Admin</button>
      {showCreateForm && (
        <ModalContent
          open={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setUsernameToUpdate('');
          }}
        >
          <AdminForm
            closeCreateForm={() => {
              setShowCreateForm(false);
              setUsernameToUpdate('');
            }}
            usernameToUpdate={usernameToUpdate}
          />
        </ModalContent>
      )}
      <AdminTable
        admins={admins}
        handleUpdateAdmin={handleUpdateAdmin}
        openConfirmDelete={openConfirmDelete}
      />
      {showConfirmDelete && adminToDelete && (
        <ModalContent
          onClose={() => setShowConfirmDelete(false)}
          open={showConfirmDelete}
        >
          <AreYouSure
            onCancel={() => setShowConfirmDelete(false)}
            message={`Are you sure you want to delete ${adminToDelete}? This will permanently delete ${adminToDelete}.`}
            onConfirm={handleDeleteAdmin}
          />
        </ModalContent>
      )}
    </>
  );
};

export default Admin;
