export const adminButtons = [
  {
    icon: '📚',
    text: 'Справочники',
    action: (setIsOpen) => setIsOpen(true),
    modal: 'directories'
  },
  {
    icon: '👥',
    text: 'Управление пользователями',
    action: (setIsOpen) => setIsOpen(true),
     modal: 'users'
  },
  {
    icon: '🕰️',
    text: 'История',
    action: null,
    modal: null
}
]