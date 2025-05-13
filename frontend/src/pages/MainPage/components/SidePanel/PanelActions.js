import React, { useState } from 'react';
import { baseButtons } from './buttons/baseButtons';
import { adminButtons } from './buttons/adminButtons';
import { ocoButtons } from './buttons/ocoButtons';
import ScriptSelectModal from '../ScriptSelectModal/ScriptSelectModal';
import ZnoModal from '../ZnoModal/ZnoModal';
import ReportModal from '../ReportModal/ReportModal';
import DirectoriesModal from '../DirectoriesModal/DirectoriesModal';
import UsersModal from '../UsersModal/UsersModal';
import {getZnoById} from '../../../../api/api'
import './SidePanel.css';
import { useNavigate } from 'react-router-dom';
import { useAuthSync } from '../../../useAuthSync';


const PanelActions = ({ selectedAppId, onForceRefreshTable }) => {
  useAuthSync();
  const authData = JSON.parse(localStorage.getItem('auth')) || {};
  const userRights = authData.rights || 0;
  const [copyZnoId, setCopyZnoId] = useState(null);
  const [modals, setModals] = useState({
    createZno: false,
    report: false,
    scripts: false,
    users: false,
  });
    const navigate = useNavigate();
  const [editZnoId, setEditZnoId] = useState(null);

  const isAdmin = userRights === 1;
  const isOko = userRights === 2;

  const handleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  const getButtons = () => {
    const buttons = [...baseButtons];
    if (isAdmin) buttons.push(...adminButtons);
    if (isOko) buttons.push(...ocoButtons);
    return buttons;
  };

  const handleCopyClick = () => {
  if (!selectedAppId) {
    alert("Сначала выберите заявку в таблице");
    return;
  }
  setCopyZnoId(selectedAppId);
};

  const handleEditClick = async () => {
    if (!selectedAppId) {
      alert("Сначала выберите заявку в таблице");
      return;
    }

    try {
      // Получаем заявку по ID через API
      const selectedZno = await getZnoById(selectedAppId);

      // Проверка прав и статуса заявки
      const userId = authData.id;

      // ограничение редактирования для ОКО
      if (userRights === 2 && (![0, 1, 2, 3].includes(selectedZno.id_status))) {
        alert('Редактирование заявки запрещено для вас.');
        return;
      }

      // ограничение редактирования для работника
      if (userRights === 3 && (![0, 1, 2].includes(selectedZno.id_status))) {
        alert('Редактирование заявки запрещено для вас.');
        return;
      }

      setEditZnoId(selectedAppId); // Открываем модалку для редактирования
    } catch (error) {
      console.error('Ошибка при загрузке заявки:', error);
      alert('Ошибка при загрузке заявки.');
    }
  };

  return (
    <>
      <div className="panel-actions-grid">
        {getButtons().map((btn, index) => (
          <button
            key={index}
            className="panel-btn square"
            onClick={() => {
              if (btn.text === 'История') {
                navigate('/history');
              } else if (btn.modal === 'editZno') {
                handleEditClick();
              } else if (btn.modal === 'copyZno') {
                handleCopyClick();
              } else if (btn.modal) {
                handleModal(btn.modal, true);
              } else {
                btn.action();
              }
            }}
          >
            <span className="icon">
            {btn.icon}
            </span>
            <span>{btn.text}</span>
          </button>
        ))}
      </div>

      {modals.createZno && (
        <ZnoModal onClose={() => handleModal('createZno', false)} isEditMode={false} />
      )}

      {editZnoId && (
        <ZnoModal
          onClose={() => setEditZnoId(null)}
          isEditMode={true}
          selectedZnoId={editZnoId}
        />
      )}
      {copyZnoId && (
          <ZnoModal
            onClose={() => setCopyZnoId(null)}
            isEditMode={false}
            selectedZnoId={copyZnoId}
            isCopyMode={true}
          />
        )}
      {modals.scripts && <ScriptSelectModal onClose={() => handleModal('scripts', false)} />}
      {modals.report && <ReportModal onClose={() => handleModal('report', false)} />}
      {modals.directories && <DirectoriesModal onClose={() => handleModal('directories', false)} />}
      {modals.users && <UsersModal onClose={() => handleModal('users', false)} />}
    </>
  );
};

export default PanelActions;
