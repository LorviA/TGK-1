import { useState } from 'react';
import './FilterModal.css';

const dateFields = [
  'дата оплаты по договору',
  'планируемая дата оплаты',
  'дата оплаты',
  'дата создания'
];

const FilterModal = ({ field, onApply, onCancel }) => {
  const [textValue, setTextValue] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const isDateField = dateFields.includes(field.toLowerCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDateField) {
      onApply({
        type: 'date',
        from: dateFrom,
        to: dateTo
      });
    } else {
      onApply({
        type: 'text',
        value: textValue
      });
    }
  };

  return (
    <div className="filter-modal-overlay" onClick={onCancel}>
      <div className="filter-modal" onClick={e => e.stopPropagation()}>
        <h3>Фильтр по полю: {field}</h3>
        <form onSubmit={handleSubmit}>
          {isDateField ? (
            <div className="date-range-filter">
              <div className="date-input-group">
                <label>От:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="date-input"
                  autoFocus
                />
              </div>
              <div className="date-input-group">
                <label>До:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={`Введите значение для ${field}`}
              autoFocus
            />
          )}
          <div className="filter-modal-buttons">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Отмена
            </button>
            <button type="submit" className="apply-btn">
              Применить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;