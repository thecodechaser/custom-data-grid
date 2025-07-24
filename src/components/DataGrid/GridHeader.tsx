import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  Eye, 
  EyeOff, 
  Pin, 
  PinOff,
  GripVertical 
} from 'lucide-react';
import { GridColumn } from '../../types/grid';
import { useGridStore } from '../../store/gridStore';

interface GridHeaderProps {
  columns: GridColumn[];
}

export const GridHeader: React.FC<GridHeaderProps> = ({ columns }) => {
  const { t } = useTranslation();
  const {
    sortConfig,
    setSortConfig,
    toggleColumnVisibility,
    pinColumn,
    selectedRows,
    filteredRows,
    selectAllRows,
    clearSelection
  } = useGridStore();

  const handleSort = (field: string) => {
    if (sortConfig?.field === field) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ field, direction: 'desc' });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ field, direction: 'asc' });
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      clearSelection();
    } else {
      selectAllRows();
    }
  };

  const isAllSelected = selectedRows.size === filteredRows.length && filteredRows.length > 0;
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < filteredRows.length;

  return (
    <thead className="bg-surface border-b" style={{ borderColor: 'var(--color-border)' }}>
      <tr>
        {/* Selection Column */}
        <th className="w-12 p-3 text-left">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isPartiallySelected;
                }
              }}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ 
                accentColor: 'var(--color-primary)',
                color: 'var(--color-primary)' 
              }}
            />
          </motion.div>
        </th>

        {columns.map((column, index) => (
          <motion.th
            key={column.id}
            className="p-3 text-left font-semibold relative group"
            style={{ 
              color: 'var(--color-text)',
              minWidth: column.minWidth || 100,
              width: column.width
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2">
              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-50 cursor-grab" />

              {/* Column Title */}
              <span className="truncate flex-1">{column.title}</span>

              {/* Sort Indicator */}
              {column.sortable !== false && (
                <motion.button
                  onClick={() => handleSort(column.field)}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-border/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {sortConfig?.field === column.field ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    )
                  ) : (
                    <div className="w-4 h-4 flex flex-col justify-center items-center opacity-30">
                      <ChevronUp className="w-3 h-2" />
                      <ChevronDown className="w-3 h-2" />
                    </div>
                  )}
                </motion.button>
              )}

              {/* Filter Indicator */}
              {column.filterable !== false && (
                <Filter className="w-4 h-4 opacity-30 group-hover:opacity-60" />
              )}

              {/* Pin Indicator */}
              {column.pinned && (
                <Pin className="w-4 h-4 opacity-60" style={{ color: 'var(--color-accent)' }} />
              )}
            </div>

            {/* Column Actions Dropdown */}
            <div className="absolute top-full left-0 mt-1 bg-surface border shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-48">
              <div className="space-y-1">
                <button
                  onClick={() => toggleColumnVisibility(column.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-border/10 transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  <EyeOff className="w-4 h-4" />
                  {t('columns.hide')}
                </button>
                
                <button
                  onClick={() => pinColumn(column.id, column.pinned ? null : 'left')}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-border/10 transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  {column.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {column.pinned ? t('columns.unpin') : t('columns.pin')}
                </button>
              </div>
            </div>
          </motion.th>
        ))}
      </tr>
    </thead>
  );
};