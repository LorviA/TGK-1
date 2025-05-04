
export const USER_RIGHTS = {
  ADMIN: { id: 1, label: 'Админ' },
  OKO_EMPLOYEE: { id: 2, label: 'Сотрудник ОКО' },
  WORKER: { id: 3, label: 'Работник' },
  BANNED: { id: 4, label: 'Заблокирован' }
};

export const getRightLabel = (rightId) => {
  return Object.values(USER_RIGHTS).find(r => r.id === rightId)?.label || 'Неизвестно';
};

export const RIGHTS_OPTIONS = [
  USER_RIGHTS.ADMIN,
  USER_RIGHTS.OKO_EMPLOYEE,
  USER_RIGHTS.WORKER
];