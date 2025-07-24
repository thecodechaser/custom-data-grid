import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Plus, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useGridStore } from '../../store/gridStore';
import { FilterCondition } from '../../types/grid';
import "react-datepicker/dist/react-datepicker.css";

export const FilterPanel: React.FC = () => {
  const { t } = useTranslation();
  const { columns, filters, addFilter, removeFilter } = useGridStore();
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<FilterCondition>>({
    field: '',
    operator: 'contains',
    value: ''
  });

  const filterableColumns = columns.filter(col => col.filterable !== false);

  const operatorOptions = [
    { value: 'equals', label: t('filter.equals') },
    { value: 'contains', label: t('filter.contains') },
    { value: 'startsWith', label: t('filter.startsWith') },
    { value: 'endsWith', label: t('filter.endsWith') },
    { value: 'gt', label: t('filter.greaterThan') },
    { value: 'lt', label: t('filter.lessThan') },
    { value: 'between', label: t('filter.between') },
  ];

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== undefined) {
      addFilter(newFilter as FilterCondition);
      setNewFilter({ field: '', operator: 'contains', value: '' });
      setShowAddFilter(false);
    }
  };

  const renderFilterValue = (filter: FilterCondition, column: any) => {
    const baseStyle = {
      color: 'var(--color-text)',
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)'
    };

    switch (column?.type) {
      case 'date':
        return (
          <DatePicker
            selected={filter.value instanceof Date ? filter.value : new Date(filter.value)}
            onChange={(date) => {
              addFilter({ ...filter, value: date });
            }}
            className="px-3 py-1 rounded border text-sm"
            style={baseStyle}
          />
        );

      case 'select':
        if (filter.operator === 'in') {
          return (
            <Select
              isMulti
              options={column.options?.map((opt: string) => ({ value: opt, label: opt }))}
              value={filter.values?.map(val => ({ value: val, label: val }))}
              onChange={(selected) => {
                addFilter({ 
                  ...filter, 
                  values: selected?.map(s => s.value) || [] 
                });
              }}
              className="min-w-48"
              styles={{
                control: (base) => ({ ...base, ...baseStyle }),
                menu: (base) => ({ ...base, backgroundColor: 'var(--color-surface)' }),
                option: (base) => ({ ...base, color: 'var(--color-text)' })
              }}
            />
          );
        }
        return (
          <select
            value={filter.value}
            onChange={(e) => addFilter({ ...filter, value: e.target.value })}
            className="px-3 py-1 rounded border text-sm"
            style={baseStyle}
          >
            <option value="">All</option>
            {column.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'number':
        if (filter.operator === 'between') {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filter.values?.[0] || ''}
                onChange={(e) => {
                  const values = filter.values || [0, 0];
                  values[0] = Number(e.target.value);
                  addFilter({ ...filter, values });
                }}
                className="px-3 py-1 rounded border text-sm w-20"
                style={baseStyle}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>to</span>
              <input
                type="number"
                value={filter.values?.[1] || ''}
                onChange={(e) => {
                  const values = filter.values || [0, 0];
                  values[1] = Number(e.target.value);
                  addFilter({ ...filter, values });
                }}
                className="px-3 py-1 rounded border text-sm w-20"
                style={baseStyle}
              />
            </div>
          );
        }
        return (
          <input
            type="number"
            value={filter.value}
            onChange={(e) => addFilter({ ...filter, value: Number(e.target.value) })}
            className="px-3 py-1 rounded border text-sm"
            style={baseStyle}
          />
        );

      default:
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) => addFilter({ ...filter, value: e.target.value })}
            className="px-3 py-1 rounded border text-sm"
            style={baseStyle}
          />
        );
    }
  };

  if (filters.length === 0 && !showAddFilter) {
    return null;
  }

  return (
    <motion.div
      className="border-b bg-surface p-4"
      style={{ borderColor: 'var(--color-border)' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Filters
        </h3>
        
        <motion.button
          onClick={() => setShowAddFilter(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded border hover:bg-border/10"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Filter
        </motion.button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {filters.filter(f => f.field !== '_search').map((filter, index) => {
            const column = columns.find(col => col.field === filter.field);
            
            return (
              <motion.div
                key={`${filter.field}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                style={{ borderColor: 'var(--color-border)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <span 
                  className="font-medium min-w-24"
                  style={{ color: 'var(--color-text)' }}
                >
                  {column?.title}
                </span>
                
                <select
                  value={filter.operator}
                  onChange={(e) => {
                    const updatedFilter = { ...filter, operator: e.target.value as any };
                    if (e.target.value === 'in') {
                      updatedFilter.values = [];
                    } else if (e.target.value === 'between') {
                      updatedFilter.values = [0, 0];
                    }
                    addFilter(updatedFilter);
                  }}
                  className="px-3 py-1 rounded border text-sm"
                  style={{
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {operatorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {renderFilterValue(filter, column)}

                <motion.button
                  onClick={() => removeFilter(filter.field)}
                  className="p-1 rounded hover:bg-error/20 text-error"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Filter Form */}
        <AnimatePresence>
          {showAddFilter && (
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg border bg-background"
              style={{ borderColor: 'var(--color-primary)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <select
                value={newFilter.field}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                className="px-3 py-1 rounded border text-sm min-w-32"
                style={{
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <option value="">Select field</option>
                {filterableColumns.map(column => (
                  <option key={column.id} value={column.field}>
                    {column.title}
                  </option>
                ))}
              </select>

              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as any })}
                className="px-3 py-1 rounded border text-sm"
                style={{
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
              >
                {operatorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={newFilter.value}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                placeholder="Value"
                className="px-3 py-1 rounded border text-sm"
                style={{
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
              />

              <div className="flex gap-2">
                <motion.button
                  onClick={handleAddFilter}
                  className="px-3 py-1 text-sm rounded text-white"
                  style={{ backgroundColor: 'var(--color-success)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('filter.apply')}
                </motion.button>
                
                <motion.button
                  onClick={() => setShowAddFilter(false)}
                  className="px-3 py-1 text-sm rounded border"
                  style={{
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('actions.cancel')}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};