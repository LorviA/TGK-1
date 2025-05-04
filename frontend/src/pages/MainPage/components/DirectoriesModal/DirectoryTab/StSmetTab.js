import React, { useState, useEffect } from 'react';
import { getDirStSmet, createStSmetItem, updateStSmetItem, deleteStSmetItem } from '../../../../../api/api';
import './StSmetTab.css';
import { useAuthSync } from '../../../../useAuthSync';


const StSmetTab = () => {
  useAuthSync();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [parentSt, setParentSt] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getDirStSmet();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const hasChildren = (st) => {
    return data.some(item => item.st.startsWith(`${st}.`) && item.st !== st);
  };

  const getNextStNumber = (parent = '') => {
    // Если справочник пустой, возвращаем "1" для корневого элемента
    if (data.length === 0 && !parent) return '1';

    const siblings = data.filter(item => {
      if (!parent) return !item.st.includes('.');
      return item.st.startsWith(`${parent}.`) &&
             item.st.split('.').length === parent.split('.').length + 1;
    });

    if (siblings.length === 0) {
      return parent ? `${parent}.1` : '1';
    }

    const lastNumber = Math.max(...siblings.map(item => {
      const parts = item.st.split('.');
      return parseInt(parts[parts.length - 1]);
    }));

    return parent ? `${parent}.${lastNumber + 1}` : `${lastNumber + 1}`;
  };

  const handleAdd = (parent = '') => {
    setParentSt(parent);
    setIsAdding(true);
    setEditingItem({
      st: getNextStNumber(parent),
      description: '',
      is_group: false
    });
    setError(null);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsAdding(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      if (!editingItem.description.trim()) {
        setError('Описание не может быть пустым');
        return;
      }

      // Получаем user_id из localStorage
      const auth = JSON.parse(localStorage.getItem('auth')) || {};
      const userId = auth.id;
      if (!userId) throw new Error('User ID не найден');

      const itemData = {
        ...editingItem,
        user_id: userId
      };

      if (isAdding) {
        const newItem = await createStSmetItem(itemData);
        setData([...data, newItem]);
      } else {
        const updatedItem = await updateStSmetItem(editingItem.id, itemData);
        setData(data.map(item => item.id === updatedItem.id ? updatedItem : item));
      }

      setEditingItem(null);
      setIsAdding(false);
      setParentSt('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, st) => {
    try {
      if (hasChildren(st)) {
        throw new Error('Нельзя удалить группу с дочерними элементами');
      }

      // Получаем user_id из localStorage
      const auth = JSON.parse(localStorage.getItem('auth')) || {};
      const userId = auth.id;
      if (!userId) throw new Error('User ID не найден');

      await deleteStSmetItem(id, userId);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const renderTree = (items, parent = '', level = 0) => {
    const filteredItems = items
      .filter(item => {
        const parts = item.st.split('.');
        const itemParent = parts.slice(0, -1).join('.');
        return itemParent === parent;
      })
      .sort((a, b) => a.st.localeCompare(b.st, undefined, { numeric: true }));

    return (
      <>
        {filteredItems.map(item => (
          <React.Fragment key={item.id}>
            <div className="st-smet-tree-node" style={{ marginLeft: `${level * 20}px` }}>
              <div className="st-smet-node-content">
                <span>
                  {item.is_group ? '📁 ' : '📄 '}
                  {item.st} {item.description}
                </span>
                <div className="st-smet-item-actions">
                  <button className="st-smet-action-btn st-smet-edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                  {!hasChildren(item.st) && (
                    <button className="st-smet-action-btn st-smet-delete-btn" onClick={() => handleDelete(item.id, item.st)}>🗑️</button>
                  )}
                  {item.is_group && (
                    <button
                      className="st-smet-action-btn st-smet-add-sub-btn"
                      onClick={() => handleAdd(item.st)}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>

            {editingItem?.id === item.id && (
              <div className="st-smet-edit-form" style={{ marginLeft: `${level * 20 + 20}px` }}>
                <div className="st-smet-form-row">
                  <label>Номер:</label>
                  <input
                    type="text"
                    value={editingItem.st}
                    onChange={(e) => setEditingItem({ ...editingItem, st: e.target.value })}
                    disabled={!isAdding}
                  />
                </div>
                <div className="st-smet-form-row">
                  <label>Описание:</label>
                  <input
                    type="text"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>
                <div className="st-smet-form-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingItem.is_group}
                      disabled={!isAdding && hasChildren(editingItem.st)}
                      onChange={(e) => setEditingItem({ ...editingItem, is_group: e.target.checked })}
                    />
                    Это группа
                  </label>
                </div>
                {error && <div className="st-smet-form-error">{error}</div>}
                <div className="st-smet-form-actions">
                  <button className="st-smet-save-btn" onClick={handleSave}>
                    Сохранить
                  </button>
                  <button
                    className="st-smet-cancel-btn"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAdding(false);
                      setError(null);
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {item.is_group && renderTree(items, item.st, level + 1)}
          </React.Fragment>
        ))}

        {isAdding && parentSt === parent && (
          <div className="st-smet-edit-form" style={{ marginLeft: `${level * 20 + 20}px` }}>
            <div className="st-smet-form-row">
              <label>Номер:</label>
              <input
                type="text"
                value={editingItem.st}
                onChange={(e) => setEditingItem({ ...editingItem, st: e.target.value })}
                disabled
              />
            </div>
            <div className="st-smet-form-row">
              <label>Описание:</label>
              <input
                type="text"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
            </div>
            <div className="st-smet-form-row">
              <label>
                <input
                  type="checkbox"
                  checked={editingItem.is_group}
                  onChange={(e) => setEditingItem({ ...editingItem, is_group: e.target.checked })}
                />
                Это группа
              </label>
            </div>
            {error && <div className="st-smet-form-error">{error}</div>}
            <div className="st-smet-form-actions">
              <button className="st-smet-save-btn" onClick={handleSave}>
                Сохранить
              </button>
              <button
                className="st-smet-cancel-btn"
                onClick={() => {
                  setEditingItem(null);
                  setIsAdding(false);
                  setError(null);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) return <div className="st-smet-loading">Загрузка...</div>;

  return (
    <div className="st-smet-tab">
      <button className="st-smet-add-btn" onClick={() => handleAdd()}>
        + Добавить элемент
      </button>

      <div className="st-smet-tree-container">
        {data.length > 0 || isAdding ? (
          renderTree(data)
        ) : (
          <div className="st-smet-no-data">
            <p>Нет данных</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default StSmetTab;