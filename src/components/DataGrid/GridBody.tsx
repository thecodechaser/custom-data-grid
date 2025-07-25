import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GridColumn, GridRow } from '../../types/grid';
import { useGridStore } from '../../store/gridStore';
import { format } from 'date-fns';

interface GridBodyProps {
  columns: GridColumn[];
  rows: GridRow[];
}

export const GridBody: React.FC<GridBodyProps> = ({ columns, rows }) => {
  const { t } = useTranslation();
  const { selectedRows, toggleRowSelection } = useGridStore();

  const formatCellValue = (value: any, column: GridColumn) => {
    if (value === null || value === undefined) return '';
    
    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'date':
        return value instanceof Date ? format(value, 'MMM dd, yyyy') : value;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  };

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={columns.length + 1} 
            className="p-8 text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('grid.noData')}
            </motion.div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      <AnimatePresence mode="popLayout">
        {rows.map((row, index) => (
          <motion.tr
            key={row.id}
            className={`border-b transition-colors hover:bg-border/5 ${
              selectedRows.has(row.id) ? 'bg-primary/10' : ''
            }`}
            style={{ borderColor: 'var(--color-border)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            whileHover={{ 
              backgroundColor: 'var(--color-border)', 
              transition: { duration: 0.1 } 
            }}
          >
            <td className="w-12 p-3">
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
              </motion.div>
            </td>
            {columns.map((column) => (
              <motion.td
                key={`${row.id}-${column.id}`}
                className="p-3 truncate"
                style={{ 
                  color: 'var(--color-text)',
                  maxWidth: column.width || 200
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.1 }
                }}
              >
                <div className="truncate" title={String(row[column.field])}>
                  {formatCellValue(row[column.field], column)}
                </div>
              </motion.td>
            ))}
          </motion.tr>
        ))}
      </AnimatePresence>
    </tbody>
  );
};