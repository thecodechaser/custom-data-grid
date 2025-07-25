import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Palette, Globe } from 'lucide-react';
import { useGridStore } from '../../store/gridStore';
import { themes } from '../../store/gridStore';

export const ThemeSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, locale, setLocale } = useGridStore();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode);
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 border rounded-lg shadow-lg bg-surface"
        style={{ borderColor: 'var(--color-border)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 z-50 w-64 p-4 mt-2 border rounded-lg shadow-xl top-full bg-surface"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <h3 
                className="mb-3 text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Themes
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {themes.map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => handleThemeChange(t)}
                    className={`flex items-center gap-3 p-2 rounded-lg border text-left w-full ${
                      theme.id === t.id ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: 'var(--color-border)',
                      ringColor: theme.id === t.id ? 'var(--color-primary)' : 'transparent'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: t.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: t.colors.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: t.colors.accent }}
                      />
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {t.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <h3 
                className="flex items-center gap-2 mb-3 text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                <Globe className="w-4 h-4" />
                Language
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-3 py-2 text-sm rounded-lg text-left w-full ${
                      locale === lang.code ? 'bg-primary text-white' : 'hover:bg-border/10'
                    }`}
                    style={{
                      backgroundColor: locale === lang.code ? 'var(--color-primary)' : 'transparent',
                      color: locale === lang.code ? 'white' : 'var(--color-text)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};