import React, { useState, useEffect } from 'react';
import {
  uploadZnoPayment,
  uploadSmsps,
  setUsersExpiration,
  setDirectoriesConfidentialityExpiration,
  setDirectoriesStSmetExpiration
} from '../../../../api/api';
import './ScriptSelectModal.css';
import { useAuthSync, checkAuthRights } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';
import ArchiveViewModal from './ArchiveViewModal';

const ScriptSelectModal = ({ onClose }) => {
  useAuthSync();
  const [selectedScript, setSelectedScript] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRights, setUserRights] = useState(null);
  const [expirationDate, setExpirationDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    setUserRights(auth?.rights || 0);
  }, []);

  const scripts = [
    { id: 1, name: 'Загрузка информации об оплате ЗНО', api: uploadZnoPayment, type: 'file' },
    { id: 2, name: 'Загрузка информации о СМСП', api: uploadSmsps, type: 'file' },
    { id: 3, name: 'Архивирование пользователей', adminOnly: true, type: 'archive' },
    { id: 4, name: 'Архивирование справочников', adminOnly: true, type: 'archive' }
  ];

  const directories = [
    { id: 'st_smet', name: 'Статьи сметы', api: setDirectoriesStSmetExpiration },
    { id: 'conf_info', name: 'Конфиденциальная информация', api: setDirectoriesConfidentialityExpiration }
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleScriptSelect = (script) => {
    setSelectedScript(script);
    setSelectedFile(null);
    setSelectedDirectory(null);
  };

  const handleUpload = async () => {
    if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }
    if (!selectedFile || !selectedScript?.api) return;

    setIsLoading(true);
    try {
      const result = await selectedScript.api(selectedFile);
      alert(result.message || 'Файл успешно загружен');
      setSelectedFile(null);

    } catch (error) {
      alert('Ошибка при загрузке файла: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }
    setIsArchiveLoading(true);
    try {
      let result;
      if (selectedScript.id === 3) {
        result = await setUsersExpiration({ expiration_date: expirationDate });
      } else if (selectedScript.id === 4 && selectedDirectory) {
        result = await selectedDirectory.api({ expiration_date: expirationDate });
      }
      alert(result?.message || 'Дата архивирования успешно установлена');

    } catch (error) {
      alert('Ошибка: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsArchiveLoading(false);
    }
  };

  const filteredScripts = scripts.filter(script =>
    !script.adminOnly || userRights === 1
  );

  return (
    <>
      <div
        className="script-modal-backdrop"
        onClick={() => {
          eventBus.emit('refreshTable');
          onClose();
        }}
      />
      <div className="script-modal-container">
        <button
          className="close-btn"
          onClick={() => {
            eventBus.emit('refreshTable');
            onClose();
          }}
        >
          ×
        </button>
        <h3 className="script-modal-title">Выбор скрипта</h3>

        <div className="script-modal-content">
          <div className="script-modal-list">
            <ul>
              {filteredScripts.map((script) => (
                <li
                  key={script.id}
                  className={selectedScript?.id === script.id ? 'script-modal-active' : ''}
                  onClick={() => handleScriptSelect(script)}
                >
                  {script.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="script-modal-form">
            {selectedScript?.type === 'file' ? (
              <>
                <div className="file-upload-container">
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="file-upload-input"
                    />
                    <div className="file-upload-content">
                      <span className="upload-icon">📤</span>
                      <span>Выберите файл .xlsx</span>
                    </div>
                  </label>
                  {selectedFile && (
                    <div className="selected-file-info">
                      Выбран: {selectedFile.name}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading}
                  className="script-modal-upload-btn"
                >
                  {isLoading ? 'Загрузка...' : 'Загрузить'}
                </button>
              </>
            ) : selectedScript?.type === 'archive' ? (
              <div className="archive-script-container">
                {selectedScript.id === 4 && (
                  <div className="directory-selector">
                    <label className="directory-selector-label">Выберите справочник:</label>
                    <div className="directory-options">
                      {directories.map(dir => (
                        <div
                          key={dir.id}
                          className={`directory-option ${selectedDirectory?.id === dir.id ? 'selected' : ''}`}
                          onClick={() => setSelectedDirectory(dir)}
                        >
                          {dir.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedScript.id === 3 || selectedDirectory) && (
                  <>
                    <div className="archive-date-picker">
                      <label>Установите дату архивирования:</label>
                      <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="date-input"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleArchive}
                        disabled={isArchiveLoading}
                        className="script-modal-archive-btn"
                      >
                        {isArchiveLoading ? 'Установка...' : 'Установить дату архивирования'}
                      </button>
                      {selectedDirectory && (
                        <button
                          onClick={() => setShowArchiveModal(true)}
                          className="script-modal-archive-btn"
                          style={{ backgroundColor: '#666' }}
                        >
                          Показать архив
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="script-modal-notice">
                Выберите скрипт для продолжения
              </div>
            )}
          </div>
        </div>

        <div className="script-modal-actions">

        </div>
      </div>

      <ArchiveViewModal
        visible={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        directoryType={selectedDirectory?.id}
      />
    </>
  );
};

export default ScriptSelectModal;