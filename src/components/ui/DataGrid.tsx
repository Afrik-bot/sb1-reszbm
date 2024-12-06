import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

interface DataGridProps<T> {
  data: T[];
  columns: {
    header: string;
    cell: (props: { row: T }) => React.ReactNode;
  }[];
}

export function DataGrid<T>({ data, columns }: DataGridProps<T>) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeaderCell key={index}>{column.header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                {column.cell({ row })}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}