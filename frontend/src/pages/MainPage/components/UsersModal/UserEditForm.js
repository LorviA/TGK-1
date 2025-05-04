import React, { useState } from 'react';
import './UsersModal.css';
import { USER_RIGHTS } from '../../../../userRights';

const UserEditForm = ({
  user,
  formData,
  onFormChange,
  onSave,
  passwordVisible,
  onTogglePasswordVisibility
}) => {
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const  value  = e.target.value;
    onFormChange(e);

    if (value && !validateEmail(value)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };

  const handleSaveWithValidation = () => {
    if (!validateEmail(formData.email)) {
      alert('Пожалуйста, введите корректный email адрес');
      return;
    }
    onSave();
  };

  if (!user) {
    return (
      <div className="empty-edit">
        <p>Выберите пользователя для редактирования</p>
      </div>
    );
  }

  return (
    <div className="user-edit-form">
      <h3>Редактирование пользователя</h3>

      <div className="form-group">
        <label>Логин:</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={onFormChange}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleEmailChange}
          className={!emailValid ? 'invalid-input' : ''}
        />
        {!emailValid && (
          <div className="error-hint">Некорректный формат email</div>
        )}
      </div>

      <div className="form-group">
        <label>Права:</label>
        <select
          name="rights"
          value={formData.rights}
          onChange={onFormChange}
        >
          {Object.values(USER_RIGHTS).map(right => (
            <option key={right.id} value={right.id}>
              {right.label}
            </option>
          ))}
        </select>
      </div>

      {user.expiration_date && formData.rights !== 1 && (
        <div className="form-group">
          <label>Дата архиврования:</label>
          <input
            type="text"
            value={user.expiration_date}
            disabled
          />
        </div>
      )}

      <div className="form-group password-group">
        <label>Новый пароль:</label>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onFormChange}
            placeholder="Оставьте пустым, чтобы не менять"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={onTogglePasswordVisibility}
            aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
          >
            {passwordVisible ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <button
        className="save-btn"
        onClick={handleSaveWithValidation}
        disabled={!emailValid}
      >
        Сохранить изменения
      </button>
    </div>
  );
};

export default UserEditForm;