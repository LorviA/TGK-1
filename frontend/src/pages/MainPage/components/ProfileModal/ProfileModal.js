import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRightLabel } from '../../../../userRights';
import './ProfileModal.css';
import { getUserData, updateUser, verifyUserPassword } from '../../../../api/api';
import { useAuthSync, checkAuthRights } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';

const ProfileModal = ({ onClose }) => {
  useAuthSync();
  const userId = JSON.parse(localStorage.getItem('auth'))?.id || null;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailEdit, setEmailEdit] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewEmail(value);
    setEmailValid(validateEmail(value) || value === '');
  };

  const handleEmailSave = async () => {
    if (!validateEmail(newEmail)) {
      alert('Пожалуйста, введите корректный email адрес');
      return;
    }

    try {
      if (!await checkAuthRights()) {
        alert('Права изменились! Действие отменено.');
        window.location.reload();
        return;
      }

      const success = await updateUser(userId, { email: newEmail });
      if (success) {
        setUserData(prev => ({ ...prev, email: newEmail }));
        setEmailEdit(false);
      } else {
        alert("Не удалось обновить email");
      }
    } catch (error) {
      console.error("Ошибка при обновлении email:", error);
      alert("Ошибка при обновлении email");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await getUserData(userId);
        const safeData = {
          login: data.user_name,
          rights: data.rights,
          email: data.email
        };
        setUserData(safeData);
        setNewEmail(data.email);
        setEmailValid(true);
      } catch (err) {
        console.error('Ошибка запроса:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handlePasswordSave = async () => {
    if (!oldPassword || !newPassword) {
      alert("Поля не могут быть пустыми");
      return;
    }

    try {
      const isMatch = await verifyUserPassword(userId, oldPassword);
      if (!isMatch) {
        alert("Старый пароль неверен");
        return;
      }
      if (!await checkAuthRights()) {
        alert('Права изменились! Действие отменено.');
        window.location.reload();
        return;
      }
      const success = await updateUser(userId, { password: newPassword });
      if (success) {
        alert("Пароль успешно обновлен");
        setOldPassword('');
        setNewPassword('');
        setShowPasswordFields(false);
      } else {
        alert("Ошибка при обновлении пароля");
      }
    } catch (error) {
      console.error("Ошибка при обновлении пароля:", error);
      alert("Произошла ошибка");
    }
  };

  if (loading) return null;

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={() => {
          eventBus.emit('refreshTable');
          onClose();
        }}
      />
      <div className="profile-modal">
        <div className="modal-header">
          <h2>Профиль пользователя</h2>
          <button
            className="close-btn"
            onClick={() => {
              eventBus.emit('refreshTable');
              onClose();
            }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-info-line">
            <span className="label">👤 Логин:</span>
            <span>{userData?.login}</span>
          </div>

          <div className="profile-info-line">
            <span className="label">🛡️ Права:</span>
            <span>{getRightLabel(userData?.rights)}</span>
          </div>

          <div className="info-field">
            <label>Email</label>
            {emailEdit ? (
              <div className="edit-container">
                <input
                  type="email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  className={`modern-input ${!emailValid ? 'invalid-input' : ''}`}
                />
                {!emailValid && (
                  <div className="error-hint">Некорректный формат email</div>
                )}
                <div className="action-buttons">
                  <button
                    className="action-btn confirm"
                    onClick={handleEmailSave}
                    disabled={!emailValid || newEmail === userData?.email}
                  >
                    Подтвердить
                  </button>
                  <button
                    className="action-btn cancel"
                    onClick={() => {
                      setEmailEdit(false);
                      setNewEmail(userData?.email || '');
                      setEmailValid(true);
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="field-with-action">
                <div className="field-value">{userData?.email}</div>
                <button className="edit-btn" onClick={() => setEmailEdit(true)}>
                  Изменить
                </button>
              </div>
            )}
          </div>

          <div className="password-section">
            {showPasswordFields ? (
              <>
                <div className="password-fields">
                  <input
                    type="password"
                    placeholder="Текущий пароль"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="modern-input"
                  />
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="modern-input"
                  />
                </div>
                <div className="action-buttons">
                  <button
                    className="action-btn confirm"
                    onClick={handlePasswordSave}
                    disabled={!oldPassword || !newPassword}
                  >
                    Сохранить пароль
                  </button>
                  <button
                    className="action-btn cancel"
                    onClick={() => {
                      setShowPasswordFields(false);
                      setOldPassword('');
                      setNewPassword('');
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <button className="toggle-password-btn" onClick={() => setShowPasswordFields(true)}>
                Сменить пароль
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;