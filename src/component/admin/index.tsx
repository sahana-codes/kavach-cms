import React, { useEffect, useMemo, useState } from 'react';
import { Column, useTable } from 'react-table';
import { deleteAdmin, getAllAdmins } from '../../services/admin';
import Header from '../header';
import { useSelector } from 'react-redux';
import AdminForm from './adminForm';
import Modal from '../modal';
import AreYouSure from './areYouSure';

interface Admin {
  _id: string;
  username: string;
}

const Admin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usernameToUpdate, setUsernameToUpdate] = useState('');
  const [adminToDelete, setAdminToDelete] = useState('');

  const columns: Array<Column<Admin>> = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: '_id',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Update',
        Cell: ({ row }: any) => (
          <button onClick={() => handleUpdateAdmin(row.original.username)}>
            Update
          </button>
        ),
      },
      {
        Header: 'Delete',
        Cell: ({ row }: any) => (
          <button
            onClick={() => {
              setAdminToDelete(row.original.username);
              setShowConfirmDelete(true);
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await getAllAdmins();
      const allAdmins = data.data;
      const allOtherAdmins = allAdmins.filter(
        (admin: Admin) => admin.username !== currentAdmin.username
      );
      setAdmins(allOtherAdmins);
    } catch (error) {
      console.error('Error occurred while fetching admins:', error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: admins });

  const handleUpdateAdmin = (username: string) => {
    setShowCreateForm(true);
    setUsernameToUpdate(username);
  };

  const handleDeleteAdmin = async () => {
    try {
      const { data } = await deleteAdmin(adminToDelete);
      if (data) {
        fetchAdmins();
        setShowConfirmDelete(false);
      }
    } catch (error: any) {
      console.error('Error occurred while deleting admin:', error);
    }
  };

  return (
    <>
      <Header />
      <button onClick={() => setShowCreateForm(true)}>Create New Admin</button>
      {showCreateForm && (
        <AdminForm
          fetchAdmins={fetchAdmins}
          closeCreateForm={() => {
            setShowCreateForm(false);
            setUsernameToUpdate('');
          }}
          usernameToUpdate={usernameToUpdate}
        />
      )}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {showConfirmDelete && (
        <Modal onClose={() => setShowConfirmDelete(false)}>
          <AreYouSure
            onCancel={() => setShowConfirmDelete(false)}
            message={`Are you sure you want to delete ${adminToDelete}?`}
            onConfirm={handleDeleteAdmin}
          />
        </Modal>
      )}
    </>
  );
};

export default Admin;
