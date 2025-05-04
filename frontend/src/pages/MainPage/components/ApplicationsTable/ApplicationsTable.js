import TableHeader from './TableHeader';
import TableRow from './TableRow';
import './ApplicationsTable.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchZnoData, fetchSortedZnoData, fetchFilteredZnoData } from '../../constants/znoService';
import eventBus from '../../hooks/eventBus';
import FilterModal from './FilterModal';

const ApplicationsTable = ({
  fields,
  allFields,
  selectedAppId,
  setSelectedAppId
}) => {
  const tableRef = useRef();
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({ field: null, value: null });
  const [filterField, setFilterField] = useState(null);


  const loadData = useCallback(async () => {
    try {
      let result;
      if (filterConfig.field) {
        result = await fetchFilteredZnoData(filterConfig);
      } else if (sortConfig.field) {
        result = await fetchSortedZnoData(sortConfig.field, sortConfig.direction);
      } else {
        result = await fetchZnoData();
      }
      setData(result);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  }, [filterConfig, sortConfig]);

  useEffect(() => {
    eventBus.on('refreshTable', loadData);
    loadData();
    return () => {
      eventBus.off('refreshTable', loadData);
    };
  }, [loadData]);

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    setFilterConfig({ field: null, value: null });
  };

  const handleFilter = (field, filterValue) => {
    if (!filterValue) {
      setFilterField(null);
      return;
    }

    if (filterValue.type === 'date') {
      setFilterConfig({
        field,
        type: 'date',
        value: {
          from: filterValue.from,
          to: filterValue.to
        }
      });
    } else {
      setFilterConfig({
        field,
        type: 'text',
        value: filterValue.value
      });
    }

    setSortConfig({ field: null, direction: 'asc' });
    setFilterField(null);
  };

  const handleHeaderClick = (field, e) => {
    if (e.detail === 1) {
      handleSort(field);
    } else if (e.detail === 2) {
      setFilterField(field);
    }
  };

  const handleCancelFilter = () => {
    setFilterField(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setSelectedAppId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setSelectedAppId]);

  return (
    <div className="table-container" ref={tableRef}>
      <div className="table-scroll">
        <table className="data-table bordered">
          <TableHeader
            fields={fields}
            onHeaderClick={handleHeaderClick}
            sortConfig={sortConfig}
            filterConfig={filterConfig}
            onFilter={handleFilter}
          />
          <tbody>
            {data.map((app, index) => (
              <TableRow
                key={app.id}
                data={app}
                fields={fields}
                allFields={allFields}
                index={index}
                isSelected={selectedAppId === app.id}
                onSelect={() => setSelectedAppId(app.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {filterField && (
        <FilterModal
          field={filterField}
          onApply={(value) => handleFilter(filterField, value)}
          onCancel={handleCancelFilter}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;