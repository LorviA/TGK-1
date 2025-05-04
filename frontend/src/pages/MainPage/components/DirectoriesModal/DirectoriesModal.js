import React, { useState } from 'react';
import StSmetTab from './DirectoryTab/StSmetTab';
import ConfInfoTab from './DirectoryTab/ConfOfInfTab';
import './DirectoriesModal.css';
import { useAuthSync } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';

const DirectoriesModal = ({ onClose }) => {
  useAuthSync();
  const [activeTab, setActiveTab] = useState('main');

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
        >
        </div>
      <div className="directories-modal">
        <h3>Справочники</h3>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            Статьи сметы
          </button>
          <button
            className={`tab ${activeTab === 'additional' ? 'active' : ''}`}
            onClick={() => setActiveTab('additional')}
          >
            Конфиденциальность
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'main' ? <StSmetTab /> : <ConfInfoTab />}
        </div>

        <div className="modal-actions">
          <button
            className="modal-btn close-btn"
            onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
            >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

export default DirectoriesModal;