import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BannedUserPage.css';
import { useAuthSync } from './useAuthSync';

const BannedUserPage = () => {
  useAuthSync();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Очищаем все данные авторизации
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="banned-user-overlay">
      <div className="banned-user-modal">
        <h2 className="banned-user-title">⛔ Ваш аккаунт заблокирован</h2>
        <p className="banned-user-message">Доступ к системе ограничен администратором.</p>
        <p className="banned-user-contact">Для выяснения причин обратитесь к администратору.</p>
        <button
          className="banned-user-logout-btn"
          onClick={handleLogout}
        >
          Выйти из системы
        </button>
      </div>
    </div>
  );
};

export default BannedUserPage;