import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGridStore } from '../../store/gridStore';
import { DataGridHeader } from './DataGridHeader';
import { DataGridBody } from './DataGridBody';
import { DataGridFooter } from './DataGridFooter';
import { DataGridToolbar } from './DataGridToolbar';
import { ColumnManager } from './ColumnManager';
import { ThemeSelector } from '../ThemeSelector/ThemeSelector';
import { KeyboardShortcuts } from '../KeyboardShortcuts/KeyboardShortcuts';
import { Loader2, AlertCircle } from 'lucide-react';
import { FilterPanel } from './FilterPanel';

interface DataGridProps {
  className?: string;
}

export const DataGrid: React.FC<DataGridProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const {
    theme,
    loading,
    error,
    filteredRows,
    columns,
    selectedRows,
    currentPage,
    pageSize
  } = useGridStore();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const visibleColumns = useMemo(() => 
    columns.filter(col => col.visible !== false)
  , [columns]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const gridStyle = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-border': theme.colors.border,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
  } as React.CSSProperties;

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-surface rounded-lg ${className}`}
        style={gridStyle}
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
          <span className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>
            {t('grid.loading')}
          </span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className={`flex items-center justify-center bg-surface rounded-lg ${className}`}
        style={gridStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 text-error">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg font-medium">{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-background min-h-screen mb-5 mt-10 ${className}`}
      style={gridStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fixed z-50 flex gap-2 top-4 right-4">
        <ThemeSelector />
      </div>

      <div className="px-4 py-6 mx-4 md:mx-20 sm:mx-12">
        <motion.div
          className="overflow-hidden shadow-xl bg-surface rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <DataGridToolbar onToggleFilter={() => setIsFilterOpen(prev => !prev)}/>
          <AnimatePresence>
            {isFilterOpen && (
              <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            )}
          </AnimatePresence>
          <ColumnManager />
          <div data-grid-container className="relative overflow-auto h-[75vh]">
            <motion.table 
              className="border border-indigo-900 w-max"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <DataGridHeader columns={visibleColumns} />
              <DataGridBody 
                columns={visibleColumns} 
                rows={paginatedRows}
              />
            </motion.table>
          </div>
          <DataGridFooter />
          <AnimatePresence>
            {selectedRows.size > 0 && (
              <motion.div
                className="absolute px-6 py-3 text-white transform -translate-x-1/2 rounded-lg shadow-lg bottom-4 left-1/2 bg-primary"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <span className="font-medium">
                  {selectedRows.size} {t('grid.selected')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <KeyboardShortcuts />
    </motion.div>
  );
};