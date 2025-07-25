import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GridState,
  GridColumn,
  GridRow,
  FilterCondition,
  SortConfig,
  Theme,
} from '../types/grid';

interface GridStore extends GridState {
  theme: Theme;
  locale: string;
  wsConnected: boolean;

  setColumns: (columns: GridColumn[]) => void;
  setRows: (rows: GridRow[]) => void;
  updateRow: (id: string | number, data: Partial<GridRow>) => void;
  deleteRows: (ids: (string | number)[]) => void;
  toggleRowSelection: (id: string | number) => void;
  selectAllRows: () => void;
  clearSelection: () => void;
  setSortConfig: (config: SortConfig | null) => void;
  addFilter: (filter: FilterCondition) => void;
  removeFilter: (field: string) => void;
  updateFilter: (updateId: string, updatedFilter: FilterCondition) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resizeColumn: (columnId: string, width: number) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  pinColumn: (columnId: string, position: 'left' | 'right' | null) => void;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: string) => void;
  setWSConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFiltersAndSort: () => void;
}

const themes: Theme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
  {
    id: 'dark-slate',
    name: 'Dark Slate',
    colors: {
      primary: '#6366F1',
      secondary: '#06B6D4',
      accent: '#F97316',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#06B6D4',
      warning: '#F97316',
      error: '#F87171',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#7C3AED',
      accent: '#DC2626',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#065F46',
      border: '#BBF7D0',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
    },
  },
];

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      columns: [],
      rows: [],
      filteredRows: [],
      sortConfig: null,
      filters: [],
      selectedRows: new Set(),
      currentPage: 1,
      pageSize: 25,
      totalPages: 1,
      loading: false,
      error: null,
      theme: themes[0],
      locale: 'en',
      wsConnected: false,
      setColumns: (columns) => set({ columns }),
      setRows: (rows) => {
        set({ rows });
        queueMicrotask(() => {
          get().applyFiltersAndSort();
        });
      },

      updateRow: (id, data) => {
        const rows = get().rows.map((row) =>
          row.id === id ? { ...row, ...data } : row
        );
        set({ rows });
        get().applyFiltersAndSort();
      },

      deleteRows: (ids) => {
        const rows = get().rows.filter((row) => !ids.includes(row.id));
        const selectedRows = new Set(
          [...get().selectedRows].filter((id) => !ids.includes(id))
        );
        set({ rows, selectedRows });
        get().applyFiltersAndSort();
      },

      toggleRowSelection: (id) => {
        const selectedRows = new Set(get().selectedRows);
        if (selectedRows.has(id)) {
          selectedRows.delete(id);
        } else {
          selectedRows.add(id);
        }
        set({ selectedRows });
      },

      selectAllRows: () => {
        const selectedRows = new Set(get().filteredRows.map((row) => row.id));
        set({ selectedRows });
      },

      clearSelection: () => {
        set({ selectedRows: new Set() });
      },

      setSortConfig: (config) => {
        set({ sortConfig: config });
        get().applyFiltersAndSort();
      },

      addFilter: (filter) => {
        const filters = get().filters.filter((f) => f.id !== filter.id);
        filters.push(filter);
        set({ filters, currentPage: 1 });
        get().applyFiltersAndSort();
      },

      removeFilter: (id) => {
        const filters = get().filters.filter((f) => f.id !== id);
        set({ filters });
        get().applyFiltersAndSort();
      },
      
      updateFilter: (updateId, updatedFilter) => {
        const filters = get().filters.map((f) =>
          f.id === updateId ? { ...f, ...updatedFilter } : f
        );
        set({ filters });
        get().applyFiltersAndSort();
      },

      clearFilters: () => {
        set({ filters: [], currentPage: 1 });
        get().applyFiltersAndSort();
      },

      setCurrentPage: (page) => set({ currentPage: page }),
      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

      toggleColumnVisibility: (columnId) => {
        const columns = get().columns.map((col) =>
          col.id === columnId ? { ...col, visible: !col.visible } : col
        );
        set({ columns });
      },

      resizeColumn: (columnId, width) => {
        const columns = get().columns.map((col) =>
          col.id === columnId ? { ...col, width } : col
        );
        set({ columns });
      },

      reorderColumns: (fromIndex, toIndex) => {
        const columns = [...get().columns];
        const [moved] = columns.splice(fromIndex, 1);
        columns.splice(toIndex, 0, moved);
        set({ columns });
      },

      pinColumn: (columnId, position) => {
        const columns = get().columns.map((col) =>
          col.id === columnId ? { ...col, pinned: position } : col
        );
        set({ columns });
      },

      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setWSConnected: (connected) => set({ wsConnected: connected }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      applyFiltersAndSort: () => {
        let filteredRows = [...get().rows];
        const { filters, sortConfig } = get();

        filters.forEach((filter) => {
          filteredRows = filteredRows.filter((row) => {
            if (filter.column === '_search') {
              const searchValue = String(filter.value).toLowerCase();
              return Object.values(row).some((val) =>
                String(val).toLowerCase().includes(searchValue)
              );
            }
            const value = row[filter.column];
            switch (filter.operator) {
              case 'equals':
                return value === filter.value;
              case 'contains':
                return String(value ?? '')
                  .toLowerCase()
                  .includes(String(filter.value).toLowerCase());
              case 'startsWith':
                return String(value ?? '')
                  .toLowerCase()
                  .startsWith(String(filter.value).toLowerCase());
              case 'endsWith':
                return String(value ?? '')
                  .toLowerCase()
                  .endsWith(String(filter.value).toLowerCase());
              case 'gt':
                return Number(value) > Number(filter.value);
              case 'lt':
                return Number(value) < Number(filter.value);
              case 'gte':
                return Number(value) >= Number(filter.value);
              case 'lte':
                return Number(value) <= Number(filter.value);
              case 'in':
                return (
                  Array.isArray(filter.values) && filter.values.includes(value)
                );
              case 'between':
                if (!Array.isArray(filter.values) || filter.values.length !== 2)
                  return true;
                const [min, max] = filter.values;
                // Handle dates and numbers
                if (value instanceof Date || !isNaN(Date.parse(value))) {
                  const v = new Date(value).getTime();
                  return (
                    v >= new Date(min).getTime() && v <= new Date(max).getTime()
                  );
                }
                return value >= min && value <= max;
              case 'boolean':
                return Boolean(value) === Boolean(filter.value);
              default:
                return true;
            }
          });
        });

        if (sortConfig) {
          filteredRows.sort((a, b) => {
            const aValue = a[sortConfig.field];
            const bValue = b[sortConfig.field];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        const totalPages = Math.max(
          1,
          Math.ceil(filteredRows.length / get().pageSize)
        );
        set({ filteredRows, totalPages });
      },
    }),
    {
      name: 'grid-storage',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        columns: state.columns,
        pageSize: state.pageSize,
      }),
    }
  )
);

export { themes };
