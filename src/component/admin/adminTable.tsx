import React, { useMemo, useState } from 'react';
import { Column, useTable } from 'react-table';
import { Admin } from '../../store/adminSlice';
import {
  Box,
  IconButton,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

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
  const [sortingColumn, setSortingColumn] = useState<keyof Admin>();
  const [sortDirection, setSortDirection] = useState<SortDirection>();

  const sortData = (column: keyof Admin) => {
    if (sortingColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortingColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (sortingColumn && sortDirection) {
      return [...admins].sort((a, b) => {
        const aValue = a[sortingColumn] || '';
        const bValue = b[sortingColumn] || '';

        if (aValue.toLowerCase() < bValue.toLowerCase()) {
          return sortDirection === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
    return admins;
  }, [admins, sortingColumn, sortDirection]);

  const columns: any = React.useMemo(
    () => [
      {
        Header: (
          <Tooltip title="Sort by ID">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => sortData('_id')}
              justifyContent="center"
              style={{ cursor: 'pointer' }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  marginRight: '4px',
                }}
              >
                ID
              </Typography>
              {sortingColumn === '_id' ? (
                <div
                  style={{
                    height: '20px',
                  }}
                >
                  {sortDirection === 'asc' ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                </div>
              ) : (
                <>
                  <SortIcon fontSize="small" />
                </>
              )}
            </Box>
          </Tooltip>
        ),
        accessor: '_id',
        Cell: ({ value }: { value: string }) => (
          <Box
            sx={{
              padding: '8px',
              textAlign: 'center', // Center align the cell content
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        Header: (
          <Tooltip title="Sort by Username">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => sortData('username')}
              justifyContent="center"
              style={{ cursor: 'pointer' }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  marginRight: '4px',
                }}
              >
                Username
              </Typography>
              {sortingColumn === 'username' ? (
                <div
                  style={{
                    height: '20px',
                  }}
                >
                  {sortDirection === 'asc' ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                </div>
              ) : (
                <>
                  <SortIcon fontSize="small" />
                </>
              )}
            </Box>
          </Tooltip>
        ),
        accessor: 'username',
        Cell: ({ value }: { value: string }) => (
          <Box
            sx={{
              padding: '8px',
              textAlign: 'center', // Center align the cell content
            }}
          >
            {value}
          </Box>
        ),
      },

      {
        Header: 'Actions',
        Cell: ({ row }: any) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleUpdateAdmin(row.original.username)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => openConfirmDelete(row.original.username)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    [sortingColumn, sortDirection]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: sortedData });

  return (
    <TableContainer sx={{ border: '2px solid #e0e0e0' }}>
      <Table {...getTableProps()} sx={{ borderCollapse: 'collapse' }}>
        <TableHead sx={{ borderBottom: '2px solid #e0e0e0' }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  sx={(theme) => ({
                    fontWeight: 600,
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '1rem',
                    borderRight: '2px solid #e0e0e0',
                    background: theme.palette.background.default,
                  })}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell
                    {...cell.getCellProps()}
                    sx={{
                      padding: '8px',
                      textAlign: 'center',
                      borderRight:
                        index === row.cells.length - 1
                          ? 'none'
                          : '1px solid #e0e0e0',
                    }}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
