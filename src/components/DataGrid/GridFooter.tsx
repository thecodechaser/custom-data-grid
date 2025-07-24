import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useGridStore } from '../../store/gridStore';

export const GridFooter: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentPage,
    totalPages,
    pageSize,
    filteredRows,
    setCurrentPage,
    setPageSize
  } = useGridStore();

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredRows.length);

  const pageSizeOptions = [10, 25, 50, 100];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between px-6 py-4 border-t bg-surface"
      style={{ borderColor: 'var(--color-border)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Rows per page */}
      <div className="flex items-center gap-3">
        <label 
          className="text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          {t('grid.rowsPerPage')}:
        </label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-1 rounded border bg-surface cursor-pointer"
          style={{ 
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)'
          }}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination info */}
      <div className="flex items-center gap-4">
        <span 
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {startIndex}-{endIndex} {t('grid.of')} {filteredRows.length}
        </span>

        <div className="flex items-center gap-1">
          {/* First page */}
          <motion.button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronsLeft className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
          </motion.button>

          {/* Previous page */}
          <motion.button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
          </motion.button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <motion.button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    currentPage === pageNum 
                      ? 'text-white' 
                      : 'hover:bg-border/20'
                  }`}
                  style={{
                    backgroundColor: currentPage === pageNum ? 'var(--color-primary)' : 'transparent',
                    color: currentPage === pageNum ? 'white' : 'var(--color-text)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              );
            })}
          </div>

          {/* Next page */}
          <motion.button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
          </motion.button>

          {/* Last page */}
          <motion.button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronsRight className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};