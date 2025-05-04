import React, { useState, useEffect } from 'react';
import {
  getDirConfOfInf,
  createConfItem,
  updateConfItem,
  deleteConfItem,
} from '../../../../../api/api';
import './ConfOfInfTab.css';
import { useAuthSync } from '../../../../useAuthSync';


const ConfInfoTab = () => {
  useAuthSync();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const userId = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).id : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getDirConfOfInf();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setInputValue('');
  };

  const handleSave = async () => {
    try {
      if (!inputValue.trim()) throw new Error('Название не может быть пустым');
      if (!userId) throw new Error('User ID не найден');

      const dataToSend = {
        name: inputValue,
        user_id: userId
      };

      if (editingId) {
        const updatedItem = await updateConfItem(editingId, dataToSend);
        setData(data.map(item => item.id === editingId ? updatedItem : item));
        setEditingId(null);
      } else {
        const newItem = await createConfItem(dataToSend);
        setData([...data, newItem]);
        setIsAdding(false);
      }
      setInputValue('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setEditingId(id);
      setInputValue(itemToEdit.name);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteConfItem(id);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setInputValue('');
    setError(null);
  };

  if (loading) return <div className="conf-ofinf-loading">Загрузка...</div>;
  if (error) return <div className="conf-ofinf-error">{error}</div>;

  return (
    <div className="conf-ofinf-container">
      {!isAdding && !editingId && (
        <button className="conf-ofinf-add-btn" onClick={handleAddClick}>
          + Добавить элемент
        </button>
      )}

      {(isAdding || editingId) && (
        <div className="conf-ofinf-edit-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Введите название"
            className="conf-ofinf-edit-input"
          />
          <div className="conf-ofinf-form-actions">
            <button className="conf-ofinf-save-btn" onClick={handleSave}>
              Сохранить
            </button>
            <button className="conf-ofinf-cancel-btn" onClick={handleCancel}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="conf-ofinf-items-list">
        {data.length > 0 ? (
          data.map(item => (
            <div key={item.id} className="conf-ofinf-item">
              {editingId === item.id ? null : (
                <>
                  <span className="conf-ofinf-item-name">{item.name}</span>
                  <div className="conf-ofinf-item-actions">
                    <button
                      className="conf-ofinf-edit-btn"
                      onClick={() => handleEdit(item.id)}
                    >
                      ✏️
                    </button>
                    <button
                      className="conf-ofinf-delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          !isAdding && <p className="conf-ofinf-no-data">Нет данных</p>
        )}
      </div>
    </div>
  );
};


export default ConfInfoTab;
