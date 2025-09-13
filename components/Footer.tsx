import { useGridStore } from '../store/gridStore';

export const Footer = () => {
  const { theme } = useGridStore();

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

  const year = new Date().getFullYear();

  return (
    <footer
      className="fixed bottom-0 left-0 z-50 w-full shadow-inner"
      style={gridStyle}
    >
      <div className="flex items-center justify-center px-6 py-3 text-sm">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          © {year} Custom Data Grid. All rights reserved.{' '}
          <a
            href="https://thecodechaser.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            thecodechaser.com
          </a>
        </p>
      </div>
    </footer>
  );
};
