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
    <thead className="border-b bg-surface" style={{ borderColor: 'var(--color-border)' }}>
      <tr>
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
            className="relative p-3 font-semibold text-left group"
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
              <motion.div
                className="cursor-grab"
                whileHover={{ scale: 1.1 }}
                whileDrag={{ scale: 1.1 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(event, info) => {
                  const dragDistance = info.offset.x;
                  if (Math.abs(dragDistance) > 100) {
                    const direction = dragDistance > 0 ? 1 : -1;
                    const newIndex = Math.max(0, Math.min(columns.length - 1, index + direction));
                    if (newIndex !== index) {
                      console.log(`Reorder column ${index} to ${newIndex}`);
                    }
                  }
                }}
              >
                <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-50" />
              </motion.div>
              <span className="flex-1 truncate">{column.title}</span>
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
                    <div className="flex flex-col items-center justify-center w-4 h-4 opacity-30">
                      <ChevronUp className="w-3 h-2" />
                      <ChevronDown className="w-3 h-2" />
                    </div>
                  )}
                </motion.button>
              )}
              {column.pinned && (
                <Pin className="w-4 h-4 opacity-60" style={{ color: 'var(--color-accent)' }} />
              )}
            </div>
            <div className="absolute left-0 z-50 invisible p-2 mt-1 transition-all duration-200 border rounded-lg shadow-lg opacity-0 top-full bg-surface group-hover:opacity-100 group-hover:visible min-w-48"
                 style={{ 
                   backgroundColor: 'var(--color-surface)',
                   borderColor: 'var(--color-border)',
                   boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                 }}>
              <div className="space-y-1">
                <button
                  onClick={() => toggleColumnVisibility(column.id)}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded hover:bg-border/10"
                  style={{ color: 'var(--color-text)' }}
                >
                  <EyeOff className="w-4 h-4" />
                  {t('columns.hide')}
                </button>
                
                <button
                  onClick={() => pinColumn(column.id, column.pinned ? null : 'left')}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded hover:bg-border/10"
                  style={{ color: 'var(--color-text)' }}
                >
                  {column.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {column.pinned ? t('columns.unpin') : t('columns.pin')}
                </button>
              
                <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="mb-1 text-xs text-gray-500">Column Width</div>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={column.width || 200}
                    onChange={(e) => {
                      console.log(`Resize column ${column.id} to ${e.target.value}px`);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.th>
        ))}
      </tr>
    </thead>
  );
};