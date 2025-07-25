import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DataGrid } from './components/DataGrid/DataGrid';
import { useGridStore } from './store/gridStore';
import { useWebSocket } from './hooks/useWebSocket';
import { GridColumn, GridRow } from './types/grid';
import './i18n';
import {Footer } from './components/footer';

const sampleColumns: GridColumn[] = [
  { id: '1', title: 'Name', field: 'name', type: 'text', sortable: true, filterable: true, visible: true, width: 200 },
  { id: '2', title: 'Email', field: 'email', type: 'text', sortable: true, filterable: true, visible: true, width: 240  },
  { id: '3', title: 'Age', field: 'age', type: 'number', sortable: true, filterable: true, visible: true, width: 100  },
  { id: '4', title: 'Department', field: 'department', type: 'select', sortable: true, filterable: true, width: 200, visible: true, options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] },
  { id: '5', title: 'Salary', field: 'salary', type: 'number', sortable: true, filterable: true, visible: true, width: 200 , format: (value) => `$${value.toLocaleString()}` },
  { id: '6', title: 'Join Date', field: 'joinDate', type: 'date', sortable: true, filterable: true, visible: true, width: 200  },
  { id: '7', title: 'Active', field: 'active', type: 'boolean', sortable: true, filterable: true, visible: true, width: 100  },
  { id: '8', title: 'Phone', field: 'phone', type: 'text', sortable: true, filterable: true, visible: true, width: 200  },
  { id: '9', title: 'Address', field: 'address', type: 'text', sortable: false, filterable: true, visible: true, width: 200  },
  { id: '10', title: 'Performance', field: 'performance', type: 'select', sortable: true, filterable: true, width: 200, visible: true, options: ['Excellent', 'Good', 'Average', 'Below Average'] },
];

// sample data 
const sampleRows: GridRow[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  email: `employee${i + 1}@company.com`,
  age: Math.floor(Math.random() * 40) + 25,
  department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][Math.floor(Math.random() * 5)],
  salary: Math.floor(Math.random() * 100000) + 40000,
  joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
  active: Math.random() > 0.2,
  phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
  performance: ['Excellent', 'Good', 'Average', 'Below Average'][Math.floor(Math.random() * 4)]
}));

function App() {
  const { setColumns, setRows, theme } = useGridStore();
  
  // WebSocket connection (for real-time updates)
  // useWebSocket('ws://localhost:8080/ws');

  useEffect(() => {
    // Initialize with sample data
    setColumns(sampleColumns);
    setRows(sampleRows);
  }, [setColumns, setRows]);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <DataGrid />
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;