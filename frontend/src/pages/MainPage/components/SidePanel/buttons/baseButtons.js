export const baseButtons = [
  {
    icon: '➕',
    text: 'Добавить ЗНО',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'createZno'
  },
  {
    icon: '✏️',
    text: 'Редактировать ЗНО',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'editZno'
  },
  {
    icon: '📜',
    text: 'Копировать ЗНО',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'copyZno'
  },
  {
    icon: '📄',
    text: 'Скрипты',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'scripts'
  },
  {
    icon: '📋',
    text: 'Отчёт',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'report'
  }
];