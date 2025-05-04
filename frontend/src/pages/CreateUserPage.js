import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLoginExists, registerUser } from '../api/api';
import '../styles/LoginPage.css';
import { RIGHTS_OPTIONS } from '../userRights';
import { useAuthSync, checkAuthRights } from './useAuthSync';
import logoTGK from '../logoTGK.png';

function CreateUserPage() {
  useAuthSync();
  const [form, setForm] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rights: 3
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }

    try {
      const loginExists = await checkLoginExists(form.user_name);
      if (loginExists) throw new Error('Логин уже занят');

      await registerUser({
        user_name: form.user_name,
        email: form.email,
        password: form.password,
        rights: form.rights
      });

      setSuccess(true);
      setForm({ user_name: '', email: '', password: '', confirmPassword: '', rights: 3 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="login-wrapper">
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Создание пользователя</h2>

          <input
            type="text"
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
            placeholder="Логин"
            className={`form-input ${error.includes('Логин') ? 'input-error' : ''}`}
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="form-input"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            className={`form-input ${error.includes('Пароли') ? 'input-error' : ''}`}
            required
          />

          <select
            name="rights"
            value={form.rights}
            onChange={handleChange}
            className="form-input"
          >
            {RIGHTS_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="error-message" style={{ color: 'green' }}>Пользователь создан!</div>}

          <button
            type="submit"
            className="form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать'}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="form-button"
            style={{ backgroundColor: '#6c757d' }}
          >
            Вернуться
          </button>
        </form>
      </div>

      <div className="login-left">
        <img src={logoTGK} alt="Фото" className="login-logo" />
      </div>
    </div>
  );
}

export default CreateUserPage;
