import { useState } from 'react';
import FilterModal from './FilterModal';

const TableHeader = ({ fields, onHeaderClick, sortConfig, filterConfig, onFilter }) => {
  const [filterField, setFilterField] = useState(null);

  const handleFilterClick = (field) => {
    setFilterField(field);
  };

  const handleApplyFilter = (value) => {
    onFilter(filterField, value);
    setFilterField(null);
  };

  const handleCancelFilter = () => {
    setFilterField(null);
  };

  return (
    <thead>
      <tr>
        {fields.map(field => (
          <th
            key={field}
            onClick={(e) => {
              if (e.detail === 1) onHeaderClick(field, e);
              if (e.detail === 2) handleFilterClick(field);
            }}
            style={{
              cursor: 'pointer',
              backgroundColor: filterConfig.field === field ? '#e6f7ff' :
                             sortConfig.field === field ? '#f0f0f0' : '#f1f3f4',
              position: 'relative'
            }}
          >
            {field}
            {sortConfig.field === field && (
              <span style={{ marginLeft: '5px' }}>
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
            {filterConfig.field === field && (
              <span style={{
                position: 'absolute',
                right: '5px',
                fontSize: '10px',
                color: '#1890ff'
              }}>
                ✓
              </span>
            )}
          </th>
        ))}
      </tr>
      {filterField && (
        <FilterModal
          field={filterField}
          onApply={handleApplyFilter}
          onCancel={handleCancelFilter}
        />
      )}
    </thead>
  );
};

export default TableHeader;