import React, { useEffect, useMemo, useState } from 'react';
import { Column, useTable } from 'react-table';
import { getAllAdmins } from '../../services/admin';
import Header from '../header';

interface Admin {
  _id: string;
  username: string;
  password: string;
}

const Admin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

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
        Header: 'Password',
        accessor: 'password',
      },
      {
        Header: 'Update',
        Cell: () => <button>Update</button>,
      },
      {
        Header: 'Delete',
        Cell: () => <button>Delete</button>,
      },
    ],
    []
  );

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await getAllAdmins();
      console.log(response);
      // setAdmins(response.data); // Update the admins state with the received data
    } catch (error) {
      // Handle error
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: admins });

  return (
    <>
      <Header />
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
    </>
  );
};

export default Admin;
