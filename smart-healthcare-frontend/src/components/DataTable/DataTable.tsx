import type { ReactNode } from 'react';

import {
  Checkbox,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'No records found.',
  selectable = false,
  selectedKeys,
  onSelectionChange,
}: DataTableProps<T>) {
  const selected = selectedKeys ?? new Set<string | number>();
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(getRowKey(row)));
  const someSelected = rows.some((row) => selected.has(getRowKey(row))) && !allSelected;

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(rows.map(getRowKey)));
    }
  }

  function toggleOne(key: string | number) {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  }

  return (
    <Paper variant="outlined" className={styles.paper}>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell className={styles.checkboxCell}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </TableCell>
            )}
            {columns.map((col) => (
              <TableCell key={col.key} className={styles.cell} style={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const key = getRowKey(row);
            return (
              <TableRow key={key} className={styles.row}>
                {selectable && (
                  <TableCell className={styles.checkboxCell}>
                    <Checkbox checked={selected.has(key)} onChange={() => toggleOne(key)} />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className={styles.cell} style={{ width: col.width }}>
                    {col.render ? col.render(row) : ''}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <Typography variant="body2" color="textSecondary" className={styles.empty}>{emptyMessage}</Typography>
      )}
    </Paper>
  );
}