import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Trash2, 
  Plus,
  Settings,
  RotateCcw
} from 'lucide-react';
import { useGridStore } from '../../store/gridStore';
import { exportToCSV, exportToPDF, printGrid } from '../../utils/exportUtils';

export const GridToolbar: React.FC = () => {
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
    removeFilter
  } = useGridStore();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim()) {
      // Remove existing search filter
      removeFilter('_search');
      
      // Add new search filter
      addFilter({
        field: '_search',
        operator: 'contains',
        value: value.trim()
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
      {/* Left side - Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            data-search-input
            className="pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)'
            }}
          />
        </div>

        {/* Filter indicator */}
        {filters.length > 0 && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'white' 
              }}
            >
              <Filter className="w-4 h-4" />
              {filters.length}
            </div>
            <motion.button
              onClick={clearFilters}
              className="p-1 rounded hover:bg-border/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('filter.clearAll')}
            >
              <RotateCcw className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Delete selected */}
        {selectedRows.size > 0 && (
          <motion.button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
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

        {/* Export dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-border/10 transition-colors"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            {t('actions.export')}
          </motion.button>

          {showExportMenu && (
            <motion.div
              className="absolute top-full right-0 mt-2 bg-surface border shadow-lg rounded-lg p-2 z-20 min-w-48"
              style={{ borderColor: 'var(--color-border)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-border/10 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-border/10 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </motion.div>
          )}
        </div>

        {/* Print */}
        <motion.button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-border/10 transition-colors"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer className="w-4 h-4" />
          {t('actions.print')}
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-2 rounded-lg border hover:bg-border/10 transition-colors"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Export menu backdrop */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </motion.div>
  );
};