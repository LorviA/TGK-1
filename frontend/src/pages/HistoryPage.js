import React, { useState, useEffect } from 'react';
import { getAllLogs, getUserData } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/HistoryPage.css';
import './MainPage/components/Header/Header.css'
import { useAuthSync } from './useAuthSync';

const HistoryPage = () => {
  useAuthSync();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await getAllLogs();

        const logsWithUsernames = await Promise.all(
          logsData.map(async log => {
            try {
              const user = await getUserData(log.user_id);
              return {
                ...log,
                username: user.user_name || `ID: ${log.user_id}`,
                dateObj: new Date(log.date_change)
              };
            } catch (error) {
              console.error(`Error fetching user ${log.user_id}:`, error);
              return {
                ...log,
                username: `ID: ${log.user_id}`,
                dateObj: new Date(log.date_change)
              };
            }
          })
        );

        setLogs(logsWithUsernames);
        setFilteredLogs(logsWithUsernames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let result = [...logs];

    // Фильтрация по поиску
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log =>
        log.username.toLowerCase().includes(term) ||
        log.message.toLowerCase().includes(term)
      );
    }

    // Фильтрация по дате
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      result = result.filter(log => log.dateObj >= startDate);
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(log => log.dateObj <= endDate);
    }

    setFilteredLogs(result);
  }, [searchTerm, dateRange, logs]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) return <div className="history-loading">Загрузка...</div>;
  if (error) return <div className="history-error">Ошибка: {error}</div>;

  return (
    <div className="history-container">
      <header className="header">
        <h1>История действий</h1>
        <button
          className="header-button"
          onClick={() => navigate('/')}
        >
          На главную
        </button>
      </header>

      <div className="filters-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по имени или действию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="date-range">
          <input
            type="date"
            className="date-input"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <span>—</span>
          <input
            type="date"
            className="date-input"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
        </div>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th className="column-border">Имя пользователя</th>
              <th className="column-border">Действие</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td className="column-border">{log.username}</td>
                <td className="column-border">{log.message}</td>
                <td>{formatDate(log.date_change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;