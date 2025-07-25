import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useGridStore } from '../../store/gridStore';
import { FilterCondition } from '../../types/grid';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { filters, addFilter, removeFilter, updateFilter, columns, theme } =
    useGridStore();

  const handleAddFilter = () => {
    const firstColumn = columns[0];
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      column: firstColumn?.field  || '',
      operator: 'contains',
      value: '',
      type: firstColumn?.type || 'text',
      ...(firstColumn?.type === 'select'
        ? { options: firstColumn.options || [] }
        : {}),
    };
    addFilter(newFilter);
  };

  const handleUpdateFilter = (
    filterId: string,
    updates: Partial<FilterCondition>
  ) => {
    updateFilter(filterId, updates);
  };

  const getOperatorOptions = (type: string) => {
    switch (type) {
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
          { value: 'greater_than', label: 'Greater Than' },
          { value: 'less_than', label: 'Less Than' },
          { value: 'greater_equal', label: 'Greater or Equal' },
          { value: 'less_equal', label: 'Less or Equal' },
        ];
      case 'date':
        return [
          { value: 'equals', label: 'On Date' },
          { value: 'not_equals', label: 'Not On Date' },
          { value: 'greater_than', label: 'After' },
          { value: 'less_than', label: 'Before' },
          { value: 'greater_equal', label: 'On or After' },
          { value: 'less_equal', label: 'On or Before' },
        ];
      default:
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'not_contains', label: 'Does Not Contain' },
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
          { value: 'starts_with', label: 'Starts With' },
          { value: 'ends_with', label: 'Ends With' },
        ];
    }
  };

  const renderFilterValue = (filter: FilterCondition) => {
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      theme === 'dark-slate'
        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
    }`;

    switch (filter.type) {
      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              value={filter.value}
              onChange={(e) =>
                handleUpdateFilter(filter.id, { value: e.target.value })
              }
              className={baseClasses}
            />
            <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={filter.value}
            onChange={(e) =>
              handleUpdateFilter(filter.id, { value: e.target.value })
            }
            className={baseClasses}
            placeholder="Enter number..."
          />
        );
      case 'select':
        return (
          <div className="relative">
            <select
              value={filter.value}
              onChange={(e) =>
                handleUpdateFilter(filter.id, { value: e.target.value })
              }
              className={`${baseClasses} appearance-none pr-10`}
            >
              <option value="">Select option...</option>
              {filter.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) =>
              handleUpdateFilter(filter.id, { value: e.target.value })
            }
            className={baseClasses}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`w-full max-w-4xl mx-4 p-6 rounded-lg shadow-xl border ${
              theme.id === 'dark-slate'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-500" />
                <h3
                  className={`text-lg font-semibold ${
                    theme.id === 'dark-slate' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Advanced Filters
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme.id === 'dark-slate'
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {filters.filter((filter) => filter.id !== '_search')
              .map((filter, index) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    theme.id === 'dark-slate'
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Column Selector */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme.id === 'dark-slate'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}
                      >
                        Column
                      </label>
                      <div className="relative">
                        <select
                          value={filter.column}
                          onChange={(e) => {
                            const selectedColumn = columns.find(
                              (col) => col.id === e.target.value
                            );
                            handleUpdateFilter(filter.id, {
                              column: selectedColumn?.id || '',
                              type: selectedColumn?.type || 'text',
                              ...(selectedColumn?.type === 'select'
                                ? { options: selectedColumn.options || [] }
                                : {}),
                            });
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none pr-10 transition-colors ${
                            theme.id === 'dark-slate'
                              ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                          }`}
                        >
                          {columns.map((column) => (
                            <option key={column.id} value={column.id}>
                              {column.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    {/* Operator Selector */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme.id === 'dark-slate'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}
                      >
                        Operator
                      </label>
                      <div className="relative">
                        <select
                          value={filter.operator}
                          onChange={(e) =>
                            handleUpdateFilter(filter.id, {
                              operator: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none pr-10 transition-colors ${
                            theme.id === 'dark-slate'
                              ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                          }`}
                        >
                          {getOperatorOptions(filter.type).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    {/* Value Input */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme.id === 'dark-slate'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}
                      >
                        Value
                      </label>
                      {renderFilterValue(filter)}
                    </div>

                    {/* Remove Filter */}
                    <div className="flex items-end">
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filters.filter(f => f.id !== '_search').length === 0 && (
                <div
                  className={`text-center py-8 ${
                    theme.id === 'dark-slate'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No filters applied. Click "Add Filter" to get started.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleAddFilter}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                <Filter className="w-4 h-4" />
                Add Filter
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    filters.forEach((filter) => removeFilter(filter.id))
                  }
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme.id === 'dark-slate'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
