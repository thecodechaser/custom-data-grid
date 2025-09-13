import { useGridStore } from '../store/gridStore';

export const Header = () => {
  const { theme } = useGridStore();

  return (
    <header className="fixed top-0 left-0 z-50 w-full pb-2 shadow-md" style={{background: theme.colors.background}} >
      <div className="flex items-center px-6 py-3">
        <h1 className="text-lg font-semibold" style={{ color: theme.colors.primary }}>Custom Data Grid</h1>
      </div>
    </header>
  );
};
