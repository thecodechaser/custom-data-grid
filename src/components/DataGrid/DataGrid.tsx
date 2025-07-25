import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGridStore } from '../../store/gridStore';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GridFooter } from './GridFooter';
import { GridToolbar } from './GridToolbar';
import { FilterManager } from './FilterManager';
import { ColumnManager } from './ColumnManager';
import { ThemeSelector } from '../ThemeSelector/ThemeSelector';
import { KeyboardShortcuts } from '../KeyboardShortcuts/KeyboardShortcuts';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface DataGridProps {
  className?: string;
}

export const DataGrid: React.FC<DataGridProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const {
    theme,
    loading,
    error,
    wsConnected,
    filteredRows,
    columns,
    selectedRows,
    currentPage,
    pageSize
  } = useGridStore();

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
        className={`flex items-center justify-center h-96 bg-surface rounded-lg ${className}`}
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
        className={`flex items-center justify-center h-96 bg-surface rounded-lg ${className}`}
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
      className={`bg-background min-h-screen ${className}`}
      style={gridStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fixed z-50 flex gap-2 top-4 right-4">
        <ThemeSelector />
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg bg-surface">
          {wsConnected ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-error" />
          )}
          <span className="text-sm text-text-secondary">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        <motion.div
          className="overflow-hidden shadow-xl bg-surface rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GridToolbar />
          <ColumnManager />
          <FilterManager />
          <div data-grid-container className="relative overflow-auto">
            <motion.table 
              className="w-full border-collapse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <GridHeader columns={visibleColumns} />
              <GridBody 
                columns={visibleColumns} 
                rows={paginatedRows}
              />
            </motion.table>
          </div>
          <GridFooter />
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