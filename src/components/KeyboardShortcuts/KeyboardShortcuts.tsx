import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X } from 'lucide-react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const KeyboardShortcuts: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = useKeyboardShortcuts();

  const formatKey = (key: string) => {
    return key
      .replace('ctrl+', 'Ctrl + ')
      .replace('shift+', 'Shift + ')
      .replace('alt+', 'Alt + ')
      .toUpperCase();
  };

  return (
    <>
      {/* Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 rounded-full bg-surface shadow-lg border z-40"
        style={{ borderColor: 'var(--color-border)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={t('shortcuts.title')}
      >
        <HelpCircle className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <div 
                className="bg-surface rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {t('shortcuts.title')}
                    </h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-border/20"
                    >
                      <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        style={{ borderColor: 'var(--color-border)' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {shortcut.description}
                        </span>
                        <div 
                          className="px-2 py-1 rounded text-xs font-mono bg-background"
                          style={{ 
                            color: 'var(--color-text)',
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)'
                          }}
                        >
                          {formatKey(shortcut.key)}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div 
                    className="mt-6 pt-4 border-t text-xs text-center opacity-70"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    Press ? to show this help
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