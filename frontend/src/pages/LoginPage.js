import '../styles/LoginPage.css';
import React, { useState, useEffect } from 'react';
import { findUserByLogin, verifyUserPassword, getUserData } from '../api/api';
import { useNavigate } from 'react-router-dom';
import logoTGK from '../logoTGK.png';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { rights } = JSON.parse(authData);
      if (rights === 4) {
        navigate('/banned');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userId = await findUserByLogin(login);
      if (!userId) throw new Error('Неверный логин или пароль');

      const isValid = await verifyUserPassword(userId, password);
      if (!isValid) throw new Error('Неверный логин или пароль');

      const userData = await getUserData(userId);
      localStorage.setItem('auth', JSON.stringify({
        id: userData.id,
        rights: userData.rights
      }));

      if (userData.rights === 4) {
        navigate('/banned');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={logoTGK} alt="Логотип ТГК-1" className="login-logo" />
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Вход</h2>

          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            className={`form-input ${error ? 'input-error' : ''}`}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className={`form-input ${error ? 'input-error' : ''}`}
          />

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Проверка...' : 'войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
