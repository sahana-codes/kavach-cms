import React, { useMemo, useState } from 'react';
import { Column, useTable } from 'react-table';
import { Content } from '.';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import { StyledButton } from '../login/styles';
import { ContentType } from './addContent';

interface ContentTableProps {
  contents: Content[];
  onSelectContent: (contentId: string) => Promise<void>;
  openConfirmDelete: (id: string) => void;
  contentLoading: boolean;
}

type SortDirection = 'asc' | 'desc' | undefined;

const ContentTable: React.FC<ContentTableProps> = ({
  contents,
  onSelectContent,
  openConfirmDelete,
  contentLoading,
}) => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortingColumn, setSortingColumn] = useState<keyof Content>();
  const [sortDirection, setSortDirection] = useState<SortDirection>();
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const data = useMemo(() => {
    // Apply filtering based on the selected Content Type
    if (filter) {
      return contents.filter((content) => content.contentType === filter);
    }
    return contents;
  }, [contents, filter]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  };

  const sortData = (column: keyof Content) => {
    if (sortingColumn === column) {
      // Toggle sort direction if sorting the same column
      setSortDirection((prevDirection) =>
        prevDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      // Set sorting column and default sort direction to 'asc'
      setSortingColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (sortingColumn && sortDirection) {
      return [...data].sort((a, b) => {
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
    return data;
  }, [data, sortingColumn, sortDirection]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(sortedData.length / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const columns: Array<Column<Content>> = useMemo(
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
          <Tooltip title="Sort by Title">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => sortData('title')}
              justifyContent="center"
              style={{ cursor: 'pointer' }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  marginRight: '4px',
                }}
              >
                Title
              </Typography>
              {sortingColumn === 'title' ? (
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
        accessor: 'title',
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
          <Tooltip title="Sort by Content Type">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => sortData('contentType')}
              style={{ cursor: 'pointer' }}
              justifyContent="center"
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  marginRight: '4px',
                }}
              >
                Content Type
              </Typography>
              {sortingColumn === 'contentType' ? (
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
        accessor: 'contentType',
        Cell: ({ value }: { value: string }) => (
          <Box
            sx={{
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>
              {value.toLowerCase()}
            </span>
          </Box>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }: any) => (
          <>
            <Tooltip title="Edit">
              <IconButton onClick={() => onSelectContent(row.original._id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => openConfirmDelete(row.original._id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    [sortingColumn, sortDirection]
  );

  const paginatedData = useMemo(getPaginatedData, [
    sortedData,
    currentPage,
    pageSize,
  ]);

  const handleFilterChange = (
    event: SelectChangeEvent<'AUDIO' | 'TEXT' | 'VIDEO' | 'ALL'>
  ) => {
    const selectedFilter = event.target.value as string;
    setFilter(selectedFilter === 'ALL' ? undefined : selectedFilter);
    setCurrentPage(1); // Reset to the first page when changing the filter
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: paginatedData });

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 600, marginRight: 1 }}>
          Filter:
        </Typography>
        <Select
          value={(filter as ContentType) || 'ALL'}
          onChange={handleFilterChange}
          sx={{ minWidth: '80px', maxHeight: '40px', fontWeight: 600 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="AUDIO">Audio</MenuItem>
          <MenuItem value="TEXT">Text</MenuItem>
          <MenuItem value="VIDEO">Video</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper} sx={{ border: '2px solid #e0e0e0' }}>
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
          {contentLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ padding: '8px' }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
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
          )}
        </Table>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          mb={2}
          alignItems="center"
        >
          <StyledButton onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </StyledButton>

          <Typography
            sx={{
              fontWeight: 600,
              mx: 2,
            }}
          >
            Page {currentPage} of {totalPages}
          </Typography>

          <StyledButton
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </StyledButton>
        </Box>
      </TableContainer>
    </>
  );
};

export default ContentTable;
