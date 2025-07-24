export interface GridColumn {
  id: string;
  title: string;
  field: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  visible?: boolean;
  pinned?: 'left' | 'right' | null;
  format?: (value: any) => string;
  options?: string[]; // for select type
}

export interface GridRow {
  id: string | number;
  [key: string]: any;
}

export interface FilterCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  values?: any[]; // for multi-select and between
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GridState {
  columns: GridColumn[];
  rows: GridRow[];
  filteredRows: GridRow[];
  sortConfig: SortConfig | null;
  filters: FilterCondition[];
  selectedRows: Set<string | number>;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}