import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { Content } from '.';

interface ContentTableProps {
  contents: Content[];
  onSelectContent: (contentId: string) => Promise<void>;
}

const ContentTable: React.FC<ContentTableProps> = ({
  contents,
  onSelectContent,
}) => {
  const data = React.useMemo(() => contents, [contents]);

  const columns: Array<Column<Content>> = useMemo(
    () => [
      { Header: 'ID', accessor: '_id' },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ value, row }: any) => (
          <button onClick={() => onSelectContent(row.original._id)}>
            {value}
          </button>
        ),
      },
      { Header: 'Content Type', accessor: 'contentType' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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

export default ContentTable;
