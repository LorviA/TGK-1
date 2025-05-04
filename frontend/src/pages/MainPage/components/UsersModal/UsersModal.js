import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, getUserData, updateUser } from '../../../../api/api';
import UsersList from './UsersList';
import UserEditForm from './UserEditForm';
import './UsersModal.css';
import { useAuthSync, checkAuthRights } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';

const UsersModal = ({ onClose }) => {
  useAuthSync();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    rights: '',
    user_name: '',
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const currentUserId = JSON.parse(localStorage.getItem('auth'))?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data.filter(user => user.id !== currentUserId));
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUserId]);

  const handleSelectUser = async (userId) => {
    try {
      const user = await getUserData(userId);
      setSelectedUser(user);
      setFormData({
        rights: user.rights,
        user_name: user.user_name,
        email: user.email,
        password: ''
      });
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }
    if (!selectedUser) return;

    try {
      const updates = {
        ...(formData.rights !== selectedUser.rights && { rights: Number(formData.rights) }),
        ...(formData.email !== selectedUser.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
        ...(formData.user_name !== selectedUser.user_name && { user_name: formData.user_name })
      };

      if (Object.keys(updates).length > 0) {
        await updateUser(selectedUser.id, updates);
        const updatedUser = await getUserData(selectedUser.id);
        setSelectedUser(updatedUser);
        setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
        setFormData(prev => ({ ...prev, password: '' }));
        alert('Данные успешно обновлены');
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении данных');
    }
  };

  return (
    <>
      <div
        className="users-modal-overlay"
        onClick={() => {
          eventBus.emit('refreshTable');
          onClose();
        }}
      />
      <div className="users-modal">
        <button
          className="close-users-modal"
          onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
          }}
        >
          ×
        </button>

        <UsersList
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onUserSelect={handleSelectUser}
          selectedUserId={selectedUser?.id}
          onCreateUser={() => { navigate('/createUser'); onClose(); }}
        />

        <div className="users-right-panel">
          <UserEditForm
            user={selectedUser}
            formData={formData}
            onFormChange={handleFormChange}
            onSave={handleSave}
            passwordVisible={passwordVisible}
            onTogglePasswordVisibility={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
      </div>
    </>
  );
};

export default UsersModal;