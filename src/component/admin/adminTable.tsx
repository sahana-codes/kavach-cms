import React from 'react';
import { Column, useTable } from 'react-table';
import { Admin } from '../../store/adminSlice';

interface AdminTableProps {
  admins: Admin[];
  handleUpdateAdmin: (username: string) => void;
  openConfirmDelete: (username: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  handleUpdateAdmin,
  openConfirmDelete,
}) => {
  const columns: Array<Column<Admin>> = React.useMemo(
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
          <button onClick={() => openConfirmDelete(row.original.username)}>
            Delete
          </button>
        ),
      },
    ],
    [handleUpdateAdmin, openConfirmDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: admins });

  return (
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
  );
};

export default AdminTable;
