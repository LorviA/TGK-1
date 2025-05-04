import React, { useState } from 'react';
import './ReportModal.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAllZno, getFilteredByCreateDateZno, getUserData } from '../../../../api/api';
import { transformZnoItem } from '../../constants/znoService';
import dayjs from 'dayjs';
import { ALL_FIELDS } from '../../constants/fields';
import { useAuthSync, checkAuthRights} from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';

const ReportModal = ({ onClose }) => {
  useAuthSync();
  const [periodType, setPeriodType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }
    setIsLoading(true);
    try {
      // 1. Получаем данные
      const data = periodType === 'all'
        ? await getAllZno()
        : await getFilteredByCreateDateZno(startDate, endDate);

      // 2. Форматируем данные для Excel
      const transformedData = await Promise.all(data.map(transformZnoItem));

      // 3. Подготавливаем строки для Excel (id берется из данных)
      const rows = transformedData.map(item => [
        item.id, // № п/п (id из БД)
        ...item.values.filter((_, i) => i !== 0) // Пропускаем первый элемент, так как это дублирующий id
      ]);

      // 4. Получаем user_name
      const authData = JSON.parse(localStorage.getItem('auth'));
      const userId = authData?.id;
      const user = await getUserData(userId);
      const userName = user?.user_name || 'Неизвестно';

      // 5. Генерируем имя файла
      const fileName = `${dayjs().format('DD.MM.YYYY HH_mm_ss')} ${userName} ЗНО.xlsx`;

      // 6. Создаем Excel
      const ws = XLSX.utils.aoa_to_sheet([
        ALL_FIELDS, // Заголовки
        ...rows     // Данные
      ]);

      // Рассчитываем оптимальную ширину для каждого столбца
      const colWidths = ALL_FIELDS.map((_, colIndex) => {
        return Math.max(
          ...rows.map(row => {
            // Берем текст из ячейки (конвертируем числа в строки)
            const cellValue = row[colIndex]?.toString() || '';
            // Возвращаем длину текста + небольшой запас
            return cellValue.length * 1.2;
          }),
          // Минимальная ширина по заголовку
          ALL_FIELDS[colIndex].length * 1.2
        );
      });

      // Применяем ширину столбцов
      ws['!cols'] = colWidths.map(width => ({ width }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ЗНО");

      // 7. Сохраняем файл
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

    } catch (error) {
      console.error('Ошибка генерации отчета:', error);
      alert('Ошибка при создании отчета!');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

   return (
    <>
      <div
        className="modal-backdrop"
        onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
        >
        </div>
      <div className="report-modal">
        <button
            className="close-btn"
            onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
            >
             ×
            </button>
        <h3>Создание отчета</h3>

        <div className="period-selector">
          <div className="period-options">
            <button className={`period-option ${periodType === 'all' ? 'active' : ''}`} onClick={() => setPeriodType('all')}>
              Все время
            </button>
            <button className={`period-option ${periodType === 'custom' ? 'active' : ''}`} onClick={() => setPeriodType('custom')}>
              Выбрать даты
            </button>
          </div>

          {periodType === 'custom' && (
            <div className="date-range">
              <div className="date-input">
                <label>От:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="narrow-date"
                />
              </div>
              <div className="date-input">
                <label>До:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="narrow-date"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="action-btn cancel" onClick={onClose}>
            Отмена
          </button>
          <button
            className="action-btn confirm"
            onClick={generateReport}
            disabled={isLoading || (periodType === 'custom' && (!startDate || !endDate))}
          >
            {isLoading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportModal;