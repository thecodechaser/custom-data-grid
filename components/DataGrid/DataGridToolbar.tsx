import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { useGridStore } from '../../store/gridStore';
import { exportToCSV, exportToPDF, printGrid } from '../../utils/exportUtils';

interface DataGridToolbarProps {
  onToggleFilter: () => void;
}

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({onToggleFilter }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const {
    filteredRows,
    selectedRows,
    deleteRows,
    clearFilters,
    filters,
    addFilter,
    removeFilter,
  } = useGridStore();

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (value.trim()) {
      removeFilter('_search');
      addFilter({
        id: '_search',
        column: '_search',
        operator: 'contains',
        value: value.trim(),
      });
    } else {
      removeFilter('_search');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size > 0) {
      deleteRows([...selectedRows]);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredRows);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredRows);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    printGrid();
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b bg-surface"
      style={{ borderColor: 'var(--color-border)' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex">
          <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            data-search-input
            className="py-2 pl-10 pr-4 transition-all border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
            }}
          />
          <button
            onClick={onToggleFilter}
            className="flex items-center gap-2 px-4 py-2 ml-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        {filters.filter(f => f.id !== '_search').length > 0 && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-full"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <Filter className="w-4 h-4" />
              {filters.filter(f => f.id !== '_search').length}
            </div>
            <motion.button
              onClick={clearFilters}
              className="p-1 rounded hover:bg-border/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('filter.clearAll')}
            >
              <RotateCcw
                className="w-4 h-4"
                style={{ color: 'var(--color-text-secondary)' }}
              />
            </motion.button>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {selectedRows.size > 0 && (
          <motion.button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-3 py-2 text-white transition-opacity rounded-lg hover:opacity-90"
            style={{ backgroundColor: 'var(--color-error)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-4 h-4" />
            {t('actions.delete')} ({selectedRows.size})
          </motion.button>
        )}
        <div className="relative">
          <motion.button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg hover:bg-border/10"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            {t('actions.export')}
          </motion.button>

          {showExportMenu && (
            <motion.div
              className="absolute right-0 z-20 p-2 mt-2 border rounded-lg shadow-lg top-full bg-surface min-w-48"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleExportCSV}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded hover:bg-border/10"
                style={{ color: 'var(--color-text)' }}
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded hover:bg-border/10"
                style={{ color: 'var(--color-text)' }}
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </motion.div>
          )}
        </div>
        <motion.button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg hover:bg-border/10"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer className="w-4 h-4" />
          {t('actions.print')}
        </motion.button>
      </div>
      {showExportMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </motion.div>
  );
};
