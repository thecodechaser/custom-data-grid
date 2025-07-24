import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings, Eye, EyeOff, Pin, PinOff, GripVertical } from 'lucide-react';
import { useGridStore } from '../../store/gridStore';

export const ColumnManager: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    columns, 
    toggleColumnVisibility, 
    pinColumn, 
    reorderColumns 
  } = useGridStore();

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 p-3 rounded-full shadow-lg bg-surface border"
        style={{ borderColor: 'var(--color-border)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-80 bg-surface shadow-xl z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-xl font-semibold"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Column Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded hover:bg-border/20"
                  >
                    <Settings className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
                  </button>
                </div>

                <div className="space-y-3">
                  {columns.map((column, index) => (
                    <motion.div
                      key={column.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                      style={{ borderColor: 'var(--color-border)' }}
                      whileHover={{ backgroundColor: 'var(--color-border)' }}
                    >
                      {/* Drag Handle */}
                      <GripVertical 
                        className="w-4 h-4 cursor-grab opacity-50 hover:opacity-100" 
                        style={{ color: 'var(--color-text-secondary)' }}
                      />

                      {/* Column Info */}
                      <div className="flex-1">
                        <div 
                          className="font-medium"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {column.title}
                        </div>
                        <div 
                          className="text-sm opacity-70"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {column.field}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Visibility Toggle */}
                        <motion.button
                          onClick={() => toggleColumnVisibility(column.id)}
                          className="p-1 rounded hover:bg-border/20"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={column.visible !== false ? t('columns.hide') : t('columns.show')}
                        >
                          {column.visible !== false ? (
                            <Eye className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                          ) : (
                            <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                          )}
                        </motion.button>

                        {/* Pin Toggle */}
                        <motion.button
                          onClick={() => pinColumn(column.id, column.pinned ? null : 'left')}
                          className="p-1 rounded hover:bg-border/20"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={column.pinned ? t('columns.unpin') : t('columns.pin')}
                        >
                          {column.pinned ? (
                            <PinOff className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                          ) : (
                            <Pin className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        columns.forEach(col => {
                          if (col.visible === false) {
                            toggleColumnVisibility(col.id);
                          }
                        });
                      }}
                      className="w-full px-4 py-2 text-sm rounded border hover:bg-border/10"
                      style={{
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-border)'
                      }}
                    >
                      Show All Columns
                    </button>
                    
                    <button
                      onClick={() => {
                        columns.forEach(col => {
                          if (col.pinned) {
                            pinColumn(col.id, null);
                          }
                        });
                      }}
                      className="w-full px-4 py-2 text-sm rounded border hover:bg-border/10"
                      style={{
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-border)'
                      }}
                    >
                      Unpin All Columns
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};