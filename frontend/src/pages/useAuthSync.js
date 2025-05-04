import { useEffect } from 'react';
import { getUserData } from '../api/api';

export const useAuthSync = () => {
  const syncAuth = async () => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (!authData?.id) return;

    const userData = await getUserData(authData.id);
    if (JSON.stringify(authData.rights) !== JSON.stringify(userData.rights)) {
      localStorage.setItem('auth', JSON.stringify({ ...authData, rights: userData.rights }));
      window.location.reload();
    }
  };

  useEffect(() => { syncAuth(); }, []);

  return { syncAuth };
};

// Основная функция проверки прав
export const checkAuthRights = async () => {
  const authData = JSON.parse(localStorage.getItem('auth'));
  if (!authData?.id) return false;

  const userData = await getUserData(authData.id);
  return JSON.stringify(authData.rights) === JSON.stringify(userData.rights);
};