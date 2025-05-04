import React from 'react';
import './UsersModal.css';
import { getRightLabel } from '../../../../userRights';

const UsersList = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onUserSelect,
  selectedUserId,
  onCreateUser
}) => {
  const filteredUsers = searchTerm.trim() === ''
    ? users
    : users.filter(user =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="users-left-panel">
      <div className="users-header">
        <h2>Пользователи</h2>
        <button className="create-user-btn" onClick={onCreateUser}>
          + Создать
        </button>
      </div>

      <input
        className="user-search"
        type="text"
        placeholder="Поиск по логину"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul className="user-list">
          {filteredUsers.map(user => (
            <li
              key={user.id}
              className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
              onClick={() => onUserSelect(user.id)}
            >
              <div>
                <strong>{user.user_name}</strong>
                <p>{user.email}</p>
                <small>ID: {user.id} • Права: {getRightLabel(user.rights)}</small>
              </div>
            </li>
          ))}
          {filteredUsers.length === 0 && (
            <li className="no-results">
              {searchTerm ? "Пользователи не найдены" : "Нет пользователей"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UsersList;