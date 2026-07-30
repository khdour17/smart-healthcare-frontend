import type { ReactNode } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import styles from './DataTable.module.scss';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  width?: string | number;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, rows, getRowKey, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  return (
    <Paper variant="outlined" className={styles.paper}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} className={styles.cell} style={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} className={styles.row}>
              {columns.map((col) => (
                <TableCell key={col.key} className={styles.cell} style={{ width: col.width }}>
                  {col.render ? col.render(row) : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <Typography className={styles.emptyMessage} color="textSecondary">{emptyMessage}</Typography>
      )}
    </Paper>
  );
}