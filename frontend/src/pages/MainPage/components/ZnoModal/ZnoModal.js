import React from 'react';
import './ZnoModal.css';
import ZnoForm from './ZnoForm';
import useZnoForm from './useZnoForm';
import { useAuthSync } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';


const ZnoModal = ({ onClose, isEditMode, selectedZnoId, isCopyMode = false }) =>
  {
    useAuthSync();
    const formProps = useZnoForm({ isEditMode, isCopyMode, selectedZnoId, onClose });


  return (
    <>
      <div
        className="zno-modal-backdrop"
        onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
        />
      <div className="zno-modal-container styled">
        <button
            className="zno-modal-close-icon"
            onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
            }}
            >
                ×
            </button>
        <h2>{isEditMode ? 'Редактировать ЗНО' : 'Добавить ЗНО'}</h2>
        <ZnoForm {...formProps} />
      </div>
    </>
  );
};

export default ZnoModal;
