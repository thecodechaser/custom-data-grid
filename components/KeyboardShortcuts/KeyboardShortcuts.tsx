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
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed z-40 p-3 border rounded-full shadow-lg bottom-20 left-4 bg-surface"
        style={{ borderColor: 'var(--color-border)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={t('shortcuts.title')}
      >
        <HelpCircle className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                        className="flex items-center justify-between p-3 border rounded-lg"
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
                          className="px-2 py-1 font-mono text-xs rounded bg-background"
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
                    className="pt-4 mt-6 text-xs text-center border-t opacity-70"
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