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
    reorderColumns,
    resizeColumn
  } = useGridStore();

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 p-3 border rounded-full shadow-lg top-20 right-4 bg-surface"
        style={{ borderColor: 'var(--color-border)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 z-50 h-full overflow-y-auto shadow-xl w-80 bg-surface"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1), -10px 0 10px -5px rgba(0, 0, 0, 0.04)'
              }}
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
                    layout
                      key={column.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-background"
                      style={{ borderColor: 'var(--color-border)' }}
                      whileHover={{ backgroundColor: 'var(--color-border)' }}
                      whileDrag={{ scale: 1.03, zIndex: 1000 }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      onDragEnd={(event, info) => {
                        const dragDistance = info.offset.y;
                        if (Math.abs(dragDistance) > 50) {
                          const direction = dragDistance > 0 ? 1 : -1;
                          const newIndex = Math.max(0, Math.min(columns.length - 1, index + direction));
                          if (newIndex !== index) {
                            reorderColumns(index, newIndex);
                          }
                        }
                      }}
                    >
                      <GripVertical 
                        className="w-4 h-4 opacity-50 cursor-grab hover:opacity-100" 
                        style={{ color: 'var(--color-text-secondary)' }}
                      />

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
                        
                        <div className="mt-2">
                          <label className="text-xs text-gray-500">Width: {column.width || 200}px</label>
                          <input
                            type="range"
                            min="100"
                            max="800"
                            value={column.width || 200}
                            onChange={(e) => resizeColumn(column.id, Number(e.target.value))}
                            className="w-full mt-1"
                            style={{ accentColor: 'var(--color-primary)' }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
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
                <div className="pt-4 mt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        columns.forEach(col => {
                          if (col.visible === false) {
                            toggleColumnVisibility(col.id);
                          }
                        });
                      }}
                      className="w-full px-4 py-2 text-sm border rounded hover:bg-border/10"
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
                      className="w-full px-4 py-2 text-sm border rounded hover:bg-border/10"
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