import { useHotkeys } from 'react-hotkeys-hook';
import { useGridStore } from '../store/gridStore';
import { KeyboardShortcut } from '../types/grid';
import { exportToPDF } from '../utils/exportUtils';

export const useKeyboardShortcuts = () => {
  const {
    selectedRows,
    deleteRows,
    selectAllRows,
    clearSelection,
    setCurrentPage,
    currentPage,
    totalPages,
    clearFilters,
    filteredRows
  } = useGridStore();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'ctrl+a',
      description: 'Select all rows',
      action: selectAllRows
    },
    {
      key: 'escape',
      description: 'Clear selection',
      action: clearSelection
    },
    {
      key: 'delete',
      description: 'Delete selected rows',
      action: () => {
        if (selectedRows.size > 0) {
          deleteRows([...selectedRows]);
        }
      }
    },
    {
      key: 'ctrl+f',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    },
    {
      key: 'ctrl+shift+c',
      description: 'Clear all filters',
      action: clearFilters
    },
    {
      key: 'ctrl+p',
      description: 'Print/Export to PDF',
      action: () => exportToPDF(filteredRows)
    },
    {
      key: 'pageup',
      description: 'Previous page',
      action: () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    },
    {
      key: 'pagedown',
      description: 'Next page',
      action: () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
    },
    {
      key: 'home',
      description: 'First page',
      action: () => setCurrentPage(1)
    },
    {
      key: 'end',
      description: 'Last page',
      action: () => setCurrentPage(totalPages)
    }
  ];
  shortcuts.forEach(shortcut => {
    useHotkeys(
      shortcut.key,
      (event) => {
        event.preventDefault();
        shortcut.action();
      },
      {
        enableOnFormTags: shortcut.key === 'escape' || shortcut.key === 'ctrl+f'
      }
    );
  });

  return shortcuts;
};